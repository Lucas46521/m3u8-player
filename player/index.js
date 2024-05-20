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

  // Adiciona um evento para recarregar o player e pausar/despausar o vídeo
  document.getElementById('reload-button').addEventListener('click', function() {
    const currentTime = player.currentTime;
    player.destroy(); // Destroi a instância atual do player
    const newPlayer = new Plyr('#video-player', player.options); // Cria uma nova instância do player com as mesmas opções
    newPlayer.currentTime = currentTime; // Define o tempo atual do vídeo
    player.pause(); // Pausa o vídeo antes de recarregar
  });

  // Adiciona eventos para detectar mudanças na orientação e modo de tela cheia
  window.addEventListener('orientationchange', () => {
    console.log('Orientation changed');
    player.togglePlay(); // Pausa ou despausa o vídeo
  });

  document.addEventListener('fullscreenchange', () => {
    console.log('Fullscreen mode changed');
    player.togglePlay(); // Pausa ou despausa o vídeo
  });
});