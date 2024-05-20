// index.js na raiz do projeto

document.addEventListener('DOMContentLoaded', function() {
  const playVideoBtn = document.getElementById('play-video');

  playVideoBtn.addEventListener('click', function() {
    const videoUrl = encodeURIComponent(document.getElementById('video-url').value);
    const legendUrl = encodeURIComponent(document.getElementById('legend-url').value);
    const legendFile = encodeURIComponent(document.getElementById('legend-file').files[0]);

    // Redirecionar para a página do player com os argumentos na URL
    window.location.href = `player/?url=${videoUrl}&legend=${legendUrl || legendFile}`;
  });
});