// player/index.js
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  const legendUrl = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  const title = params.get('title') ? decodeURIComponent(params.get('title')) : '';

  // Validate inputs
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

  // Initialize Video.js player
  const player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    preload: 'auto',
    controls: true,
    playbackRates: [0.1, 0.5, 1, 1.5, 2, 3],
    sources: [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }],
    tracks: legendUrl && isValidUrl(legendUrl) ? [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom'
    }] : []
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
  if (typeof player.httpSourceSelector === 'function') {
    player.httpSourceSelector();
  } else {
    console.warn('httpSourceSelector plugin is not loaded.');
  }

  // Loading and error handling
  player.on('waiting', function () {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'block';
  });
  player.on('canplay', function () {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
  });
  player.on('ready', function () {
    const loadingScreen = document.getElementById('loading-screen');
    const homeContainer = document.querySelector('.home-container');
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (homeContainer) homeContainer.style.display = 'block';
  });
  player.on('error', function () {
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = 'Erro ao carregar o vídeo. Por favor, tente novamente mais tarde.';
  });

  // Fullscreen toggle on double-click
  const videoElement = document.getElementById('video-player');
  videoElement.addEventListener('dblclick', function () {
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  // Set title
  const titleElement = document.getElementById('video-title');
  if (title && titleElement) {
    // Sanitize title to prevent XSS
    titleElement.textContent = DOMPurify ? DOMPurify.sanitize(title) : title;
  }

  // Skip buttons
  const skipBackwardButton = document.createElement('button');
  skipBackwardButton.textContent = '<< 10s';
  skipBackwardButton.className = 'vjs-skip-backward';
  skipBackwardButton.setAttribute('aria-label', 'Retroceder 10 segundos');
  skipBackwardButton.onclick = function () {
    player.currentTime(Math.max(0, player.currentTime() - 10));
  };
  player.controlBar.el().appendChild(skipBackwardButton);

  const skipForwardButton = document.createElement('button');
  skipForwardButton.textContent = '>> 10s';
  skipForwardButton.className = 'vjs-skip-forward';
  skipForwardButton.setAttribute('aria-label', 'Avançar 10 segundos');
  skipForwardButton.onclick = function () {
    player.currentTime(Math.min(player.duration() || Infinity, player.currentTime() + 10));
  };
  player.controlBar.el().appendChild(skipForwardButton);

  // Toggle legend button
  const toggleLegendButton = document.getElementById('toggle-legend');
  if (toggleLegendButton) {
    toggleLegendButton.addEventListener('click', function () {
      const tracks = player.textTracks();
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'captions') {
          tracks[i].mode = tracks[i].mode === 'showing' ? 'disabled' : 'showing';
        }
      }
    });
  }
});