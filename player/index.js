document.addEventListener('DOMContentLoaded', function () {
  // Enable Video.js debug logging
  videojs.log.level('debug');

  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  const legendUrl = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  const title = params.get('title') ? decodeURIComponent(params.get('title')) : '';

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  if (!videoUrl || !isValidUrl(videoUrl)) {
    const errorDisplay = document.createElement('div');
    errorDisplay.innerHTML = 'URL de vídeo inválida. Por favor, volte e insira uma URL válida.';
    document.body.appendChild(errorDisplay);
    console.error('URL inválida:', videoUrl);
    return;
  }

  const player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    preload: 'auto',
    controls: true,
    playbackRates: [0.1, 0.5, 1, 1.5, 2, 3],
    sources: [{
      src: videoUrl,
      type: 'application/vnd.apple.mpegurl'
    }],
    tracks: legendUrl && isValidUrl(legendUrl) ? [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom',
      default: true
    }] : [],
    html5: {
      nativeVideoTracks: true,
      nativeAudioTracks: true,
      nativeTextTracks: true,
      hls: {
        overrideNative: false // Use native HLS if available
      }
    }
  });

  // Plugins
  if (typeof player.maxQualitySelector === 'function') {
    player.maxQualitySelector({
      displayMode: 1,
      index: -2
    });
  }
  if (typeof player.mobileUi === 'function') {
    player.mobileUi({
      fullscreen: {
        enterOnRotate: true,
        exitOnRotate: true,
        lockOnRotate: true,
        lockToLandscapeOnEnter: false,
        disabled: false
      },
      touchControls: {
        seekSeconds: 10,
        tapTimeout: 300,
        disableOnEnd: false,
        disabled: false
      }
    });
  }

  // Loading and error handling
  player.on('waiting', () => {
    console.log('Video.js: Aguardando, exibindo spinner');
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'block';
  });
  player.on('canplay', () => {
    console.log('Video.js: Pronto para reproduzir, ocultando spinner');
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
  });
  player.on('ready', () => {
    console.log('Video.js: Player pronto, exibindo container');
    const loadingScreen = document.getElementById('loading-screen');
    const homeContainer = document.querySelector('.home-container');
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (homeContainer) homeContainer.style.display = 'block';
  });
  player.on('error', () => {
    const error = player.error();
    console.error('Erro no Video.js:', JSON.stringify(error, null, 2));
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = `Erro ao carregar o vídeo: ${error.message || 'Tente novamente mais tarde.'} (Código: ${error.code})`;

    // Activate native fallback player
    console.log('Ativando player nativo de fallback com URL:', videoUrl);
    const fallbackPlayer = document.getElementById('fallback-player');
    const videoPlayer = document.getElementById('video-player');
    if (fallbackPlayer && videoPlayer) {
      console.log('Configurando fallback player');
      // Set source
      const source = fallbackPlayer.querySelector('source');
      if (source) {
        source.src = videoUrl;
        source.type = 'application/vnd.apple.mpegurl';
      } else {
        console.error('Elemento <source> não encontrado no fallback-player');
      }
      // Set captions if available
      if (legendUrl && isValidUrl(legendUrl)) {
        const track = fallbackPlayer.querySelector('track');
        if (track) {
          console.log('Configurando legenda no fallback:', legendUrl);
          track.src = legendUrl;
        } else {
          console.error('Elemento <track> não encontrado no fallback-player');
        }
      }
      // Hide Video.js player and show fallback
      videoPlayer.style.display = 'none';
      fallbackPlayer.style.display = 'block';
      console.log('Fallback player visível, tentando carregar e reproduzir');
      fallbackPlayer.load();
      fallbackPlayer.play().catch(err => {
        console.error('Erro ao reproduzir fallback player:', err.message);
      });
    } else {
      console.error('Elementos video-player ou fallback-player não encontrados:', {
        videoPlayer: !!videoPlayer,
        fallbackPlayer: !!fallbackPlayer
      });
    }
  });

  // Fullscreen toggle on double-click
  const videoElement = document.getElementById('video-player');
  videoElement.addEventListener('dblclick', () => {
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  // Set title
  const titleElement = document.getElementById('video-title');
  if (title && titleElement) {
    titleElement.textContent = DOMPurify ? DOMPurify.sanitize(title) : title;
  }

  // Skip buttons
  const skipBackwardButton = document.createElement('button');
  skipBackwardButton.textContent = '<< 10s';
  skipBackwardButton.className = 'vjs-skip-backward';
  skipBackwardButton.setAttribute('aria-label', 'Retroceder 10 segundos');
  skipBackwardButton.onclick = () => {
    player.currentTime(Math.max(0, player.currentTime() - 10));
  };
  player.controlBar.el().appendChild(skipBackwardButton);

  const skipForwardButton = document.createElement('button');
  skipForwardButton.textContent = '>> 10s';
  skipForwardButton.className = 'vjs-skip-forward';
  skipForwardButton.setAttribute('aria-label', 'Avançar 10 segundos');
  skipForwardButton.onclick = () => {
    player.currentTime(Math.min(player.duration() || Infinity, player.currentTime() + 10));
  };
  player.controlBar.el().appendChild(skipForwardButton);

  // Temporary button to force fallback for testing
  window.forceFallback = function() {
    console.log('Forçando ativação do fallback player');
    const fallbackPlayer = document.getElementById('fallback-player');
    const videoPlayer = document.getElementById('video-player');
    if (fallbackPlayer && videoPlayer) {
      const source = fallbackPlayer.querySelector('source');
      if (source) {
        source.src = videoUrl;
        source.type = 'application/vnd.apple.mpegurl';
      }
      if (legendUrl && isValidUrl(legendUrl)) {
        const track = fallbackPlayer.querySelector('track');
        if (track) track.src = legendUrl;
      }
      videoPlayer.style.display = 'none';
      fallbackPlayer.style.display = 'block';
      fallbackPlayer.load();
      fallbackPlayer.play().catch(err => {
        console.error('Erro ao forçar reprodução do fallback:', err.message);
      });
    } else {
      console.error('Elementos video-player ou fallback-player não encontrados ao forçar fallback');
    }
  };
});