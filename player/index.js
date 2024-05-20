// player/index.js

document.addEventListener('DOMContentLoaded', function() {
  // Função para carregar o vídeo e a legenda
  function loadVideoAndSubtitle() {
    // Obter parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const videoUrl = params.get('url');
    const legendUrl = params.get('legend');

    // Configurações do player de vídeo
    const player = videojs('video-player', {
      controls: true,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
      responsive: true
    });

    // Carregar vídeo
    player.src({
      src: decodeURIComponent(videoUrl),
      type: 'video/mp4'
    });

    // Carregar legenda, se houver
    if (legendUrl) {
      player.addRemoteTextTrack({
        kind: 'subtitles',
        src: decodeURIComponent(legendUrl),
        srclang: 'pt',
        label: 'Portuguese',
        default: true
      });
    }
  }

  loadVideoAndSubtitle();
});