document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  const legendUrl = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  const title = decodeURIComponent(params.get('title'));

  var player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    preload: 'auto',
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }],
    tracks: [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom'
    }]
  });
  //vtt
  player.maxQualitySelector({
    'displayMode': 1,
    'index': -2
  });
  player.mobileUi()
  //
  if (typeof player.httpSourceSelector === 'function') {
    player.httpSourceSelector();
  } else {
    console.warn('httpSourceSelector plugin is not loaded.');
  }

  player.on('waiting', function() {
    document.getElementById('loading-spinner').style.display = 'block';
  });

  player.on('canplay', function() {
    document.getElementById('loading-spinner').style.display = 'none';
  });

  player.on('ready', function() {
    document.getElementById('loading-screen').style.display = 'none';
    document.querySelector('.home-container').style.display = 'block';
  });

  const videoElement = document.getElementById('video-player');
  videoElement.addEventListener('dblclick', function() {
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  player.on('error', function() {
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = 'Erro ao carregar o vídeo. Por favor, tente novamente mais tarde.';
  });

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

  const skipForwardButton = document.createElement('button');
  skipForwardButton.textContent = '>> 10s';
  skipForwardButton.className = 'vjs-skip-forward';
  skipForwardButton.onclick = function() {
    player.currentTime(player.currentTime() + 10);
  };
  player.controlBar.el().appendChild(skipForwardButton);
});
// ?url=https%3A%2F%2Ffgh5.biananset.net%2F_v7%2Fd4f0a295b9ef1a9a507713ef2d5850beeb45b67264e658cd539073196d6f347e3db43b2350248661d1bc5373fbe5ce7329f80af194b9f403105b656c7d6b930b4cd772b9b3c706881a149b92d11c3b47769f95e923213f585e8c2e693bee98bee9539610c9360411736d3d0bb3dbba99fcd952a1b2af85008a47858858fbccab%2Fmaster.m3u8