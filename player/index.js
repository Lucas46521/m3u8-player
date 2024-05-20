document.addEventListener('DOMContentLoaded', function() {
  const player = new Plyr('#video-player', {
    captions: { active: true, update: true, language: 'ct' },
    keyboard: { focused: true, global: true },
    tooltips: { controls: true },
    controls: [
      'play-large', // Botão de play grande no centro
      'play', // Botão de play/pausa
      'progress', // Barra de progresso
      'current-time', // Tempo atual
      'mute', // Botão de mudo
      'volume', // Controle de volume
      'captions', // Controle de legendas
      'settings', // Configurações (qualidade, velocidade, legendas)
      'pip', // Picture-in-Picture
      'airplay', // AirPlay
      'fullscreen' // Botão de tela cheia
    ],
    settings: ['captions', 'quality', 'speed']
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
  }
});