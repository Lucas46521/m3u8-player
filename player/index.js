document.addEventListener('DOMContentLoaded', function() {
  // Cria uma nova instância do Plyr para o elemento de vídeo com o ID 'video-player'
  const player = new Plyr('#video-player', {
    autoplay: true, // Reproduz automaticamente o vídeo ao carregar
    captions: { active: true, update: true, language: 'ct' }, // Ativa legendas com a linguagem definida como 'ct'
    keyboard: { focused: true, global: true }, // Habilita o controle do player pelo teclado
    tooltips: { controls: true }, // Exibe dicas de ferramentas para os controles do player
    controls: [ // Define quais controles serão exibidos no player
      'play-large', // Botão de reprodução grande
      'play', // Botão de reprodução
      'progress', // Barra de progresso
      'current-time', // Tempo atual
      'mute', // Botão de silenciar
      'volume', // Controle de volume
      'captions', // Botão de legendas
      'settings', // Botão de configurações
      'pip', // Botão de Picture-in-Picture
      'airplay', // Botão de Airplay
      'fullscreen' // Botão de tela cheia
    ],
    settings: ['captions', 'quality', 'speed'], // Configurações disponíveis no menu de configurações
  });

  // Obtém os parâmetros da URL, incluindo a URL do vídeo e a URL da legenda
  const params = new URLSearchParams(window.location.search);
  const videoUrl = decodeURIComponent(params.get('url'));
  const legendUrl = decodeURIComponent(params.get('legend'));

  // Define a fonte do vídeo e das legendas, se as URLs forem fornecidas
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
  } else { // Se as URLs não forem fornecidas, define uma fonte de vídeo padrão
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

  // Adiciona eventos para detectar mudanças na orientação e modo de tela cheia
  window.addEventListener('orientationchange', () => {
    console.log('Orientation changed');
    player.play(); // Reproduz o vídeo novamente se necessário após a mudança de orientação
  });

  document.addEventListener('fullscreenchange', () => {
    console.log('Fullscreen mode changed');
    player.play(); // Reproduz o vídeo novamente se necessário após a mudança de modo de tela cheia
  });
});