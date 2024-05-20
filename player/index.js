// player/index.js

document.addEventListener('DOMContentLoaded', function() {
  // Função para carregar o vídeo e a legenda
  function loadVideoAndSubtitle() {
    // Obter parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const videoUrl = params.get('url');
    const legendUrl = params.get('legend');

    // Configurar o Plyr
    const player = new Plyr('#video-player', {
      captions: { active: true, update: true, language: 'auto' },
      keyboard: { focused: true, global: true },
    });

    // Carregar vídeo
    player.source = {
      type: 'video',
      sources: [{ src: decodeURIComponent(videoUrl), type: 'video/mp4' }],
      tracks: [],
    };

    // Carregar legenda, se houver
    if (legendUrl) {
      const track = {
        kind: 'captions',
        label: 'Portuguese',
        srclang: 'pt',
        src: decodeURIComponent(legendUrl),
        default: true,
      };
      player.source.tracks.push(track);
    }
  }

  loadVideoAndSubtitle();
});