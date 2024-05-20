document.addEventListener('DOMContentLoaded', function() {
  const player = new Plyr('#video-player', {
    autoplay: true,
    captions: { active: true, update: true, language: 'ct' },
    keyboard: { focused: true, global: true },
    tooltips: { controls: true },
    controls: [
      'play-large', 
      'play', 
      'progress', 
      'current-time', 
      'mute', 
      'volume', 
      'captions', 
      'settings', 
      'pip',
      'airplay', 
      'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
  });

  const params = new URLSearchParams(window.location.search);
  const videoUrl = decodeURIComponent(params.get('url'));
  const legendUrl = decodeURIComponent(params.get('legend'));

  if (videoUrl) {
    player.source = {
      type: 'video',
      sources: [
        {
          src: videoUrl,
          type: 'video/mp4',
        },
      ],
      tracks: [
        {
          kind: 'captions',
          label: 'Custom',
          srclang: 'ct',
          src: legendUrl,
          default: true,
        },
      ],
    };
  } else {
    player.source = {
      type: 'video',
      sources: [
        {
          src: 'https://www.youtube.com/embed/NcQQVbioeZk',
          type: 'video/mp4',
        },
      ],
    };
  }

  window.addEventListener('orientationchange', () => {
    player.pause();
    setTimeout(() => {
      player.play();
    }, 500);
  });

  document.addEventListener('fullscreenchange', () => {
    player.pause();
    setTimeout(() => {
      player.play();
    }, 500);
  });
});