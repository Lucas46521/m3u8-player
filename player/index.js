document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  const legendUrl = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  const title = decodeURIComponent(params.get('title'));

  // Initialize the video player
  var player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    preload: 'auto',
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [{
      src: videoUrl,
      //type: 'video/mp4'
      type: 'application/x-mpegURL'
    }],
    tracks: [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom'
    }]
  });

  // Check if httpSourceSelector plugin is available
  if (typeof player.httpSourceSelector === 'function') {
    player.httpSourceSelector();
  } else {
    console.warn('httpSourceSelector plugin is not loaded.');
  }

  // Show loading spinner while video is loading
  player.on('waiting', function() {
    document.getElementById('loading-spinner').style.display = 'block';
  });

  // Hide loading spinner when video can be played
  player.on('canplay', function() {
    document.getElementById('loading-spinner').style.display = 'none';
  });

  // Hide loading screen and show player when video is ready
  player.on('ready', function() {
    document.getElementById('loading-screen').style.display = 'none';
    document.querySelector('.home-container').style.display = 'block';
  });

  // Toggle fullscreen on double-click
  const videoElement = document.getElementById('video-player');
  videoElement.addEventListener('dblclick', function() {
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  // Show a custom error message
  player.on('error', function() {
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = 'Erro ao carregar o vídeo. Por favor, tente novamente mais tarde.';
  });

  // Set the video title, if available
  if (title) {
    document.getElementById('video-title').textContent = title;
  }

  
  const skipBackwardButton = document.createElement('button');
  skipBackwardButton.textContent = '<< 10s';
  skipBackwardButton.className = 'vjs-skip-backward';
  skipBackwardButton.onclick = function() {
    player.currentTime(player.currentTime() - 10);
  };
  player.controlBar.el().appendChild(skipBackwardButton);

  // Add skip forward and backward buttons
  const skipForwardButton = document.createElement('button');
  skipForwardButton.textContent = '>> 10s';
  skipForwardButton.className = 'vjs-skip-forward';
  skipForwardButton.onclick = function() {
    player.currentTime(player.currentTime() + 10);
  };
  player.controlBar.el().appendChild(skipForwardButton);

 