// player/index.js

document.addEventListener('DOMContentLoaded', function() {
  // Função para carregar o vídeo e a legenda
  function loadVideoAndSubtitle() {
    // Obter parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const videoUrl = params.get('url');
    const legendUrl = params.get('legend');

    // Carregar vídeo
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.src = decodeURIComponent(videoUrl);

    // Carregar legenda, se houver
    if (legendUrl) {
      const subtitleTrack = document.createElement('track');
      subtitleTrack.kind = 'subtitles';
      subtitleTrack.src = decodeURIComponent(legendUrl);
      videoPlayer.appendChild(subtitleTrack);
    }
  }

  loadVideoAndSubtitle();
});