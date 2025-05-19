document.addEventListener('DOMContentLoaded', () => {
  const playVideoBtn = document.getElementById('play-video');
  const urlOption = document.getElementById('url-option');
  const fileOption = document.getElementById('file-option');
  const subtitleUrlInput = document.getElementById('subtitle-url');
  const subtitleFileInput = document.getElementById('subtitle-file');
  const loadingScreen = document.getElementById('loading-screen');

  // Alternar visibilidade dos inputs de legenda
  urlOption.addEventListener('change', () => {
    subtitleUrlInput.style.display = 'block';
    subtitleFileInput.style.display = 'none';
  });

  fileOption.addEventListener('change', () => {
    subtitleUrlInput.style.display = 'none';
    subtitleFileInput.style.display = 'block';
  });

  // Preencher formulário com parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  document.getElementById('video-url').value = params.get('video') ? decodeURIComponent(params.get('video')) : '';
  document.getElementById('subtitle-url').value = params.get('subtitle') ? decodeURIComponent(params.get('subtitle')) : '';
  document.getElementById('title-input').value = params.get('title') ? decodeURIComponent(params.get('title')) : '';

  // Validar URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  // Função para mostrar/esconder loading
  function toggleLoading(show) {
    loadingScreen.style.display = show ? 'block' : 'none';
    playVideoBtn.disabled = show;
  }

  // Botão Reproduzir
  playVideoBtn.addEventListener('click', () => {
    const videoUrl = document.getElementById('video-url').value.trim();
    const subtitleUrl = document.getElementById('subtitle-url').value.trim();
    const subtitleFile = document.getElementById('subtitle-file').files[0];
    const title = document.getElementById('title-input').value.trim();

    if (!videoUrl || !isValidUrl(videoUrl)) {
      alert('Por favor, insira uma URL de vídeo válida.');
      return;
    }

    let redirectUrl = `/player/player.html?video=${encodeURIComponent(videoUrl)}`;

    if (urlOption.checked && subtitleUrl) {
      if (!isValidUrl(subtitleUrl)) {
        alert('Por favor, insira uma URL de legenda válida.');
        return;
      }
      redirectUrl += `&subtitle=${encodeURIComponent(subtitleUrl)}`;
    } else if (fileOption.checked && subtitleFile) {
      if (!subtitleFile.name.endsWith('.vtt')) {
        alert('Por favor, selecione um arquivo VTT válido.');
        return;
      }
      const blobUrl = URL.createObjectURL(subtitleFile);
      redirectUrl += `&subtitle=${encodeURIComponent(blobUrl)}`;
    }

    if (title) {
      redirectUrl += `&title=${encodeURIComponent(title)}`;
    }

    toggleLoading(true);
    window.location.href = redirectUrl;
  });
});