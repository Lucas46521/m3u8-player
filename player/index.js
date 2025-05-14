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
    return;
  }

  // Configuração simplificada do Video.js
  const player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    preload: 'auto',
    controls: true,
    // Remover playbackRates para evitar manipulações complexas
    sources: [{
      src: videoUrl,
      type: 'application/vnd.apple.mpegurl' // Usar o mesmo tipo do player nativo
    }],
    tracks: legendUrl && isValidUrl(legendUrl) ? [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom'
    }] : [],
    // Desativar plugins que podem interferir
    html5: {
      nativeVideoTracks: true,
      nativeAudioTracks: true,
      nativeTextTracks: true,
      hls: {
        overrideNative: false // Usar o player nativo para HLS, se disponível
      }
    }
  });

  // Remover plugins para simplificar
  // if (typeof player.maxQualitySelector === 'function') { ... } // Comentado
  // if (typeof player.mobileUi === 'function') { ... } // Comentado

  // Loading and error handling
  player.on('waiting', () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'block';
  });
  player.on('canplay', () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
  });
  player.on('ready', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const homeContainer = document.querySelector('.home-container');
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (homeContainer) homeContainer.style.display = 'block';
  });
  player.on('error', () => {
    const error = player.error();
    console.error('Video.js error:', error);
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = `Erro ao carregar o vídeo: ${error.message || 'Tente novamente mais tarde.'} (Código: ${error.code})`;
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
});