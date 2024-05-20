document.addEventListener('DOMContentLoaded', function() {
  const player = new Plyr('#video-player', {
    autoplay: true, // Habilitando a reprodução automática
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
    // Se não houver URL de vídeo, carrega um vídeo em branco
    player.source = {
      type: 'video',
      sources: [
        {
          src: 'https://youtu.be/NcQQVbioeZk?si=YK3CruxmkMd-K_G2', // Vídeo em branco
          type: 'video/mp4',
        },
      ],
    };
  }
});