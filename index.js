// index.js (outside player folder)
document.addEventListener('DOMContentLoaded', function () {
  const playVideoBtn = document.getElementById('play-video');
  const processTinyUrlBtn = document.getElementById('process-tinyurl');
  const urlOption = document.getElementById('url-option');
  const fileOption = document.getElementById('file-option');
  const legendUrlInput = document.getElementById('legend-url');
  const legendFileInput = document.getElementById('legend-file');

  // Toggle legend input visibility based on radio buttons
  urlOption.addEventListener('change', function () {
    legendUrlInput.style.display = 'block';
    legendFileInput.style.display = 'none';
  });
  fileOption.addEventListener('change', function () {
    legendUrlInput.style.display = 'none';
    legendFileInput.style.display = 'block';
  });

  // Initialize form with query parameters (if any)
  const params = new URLSearchParams(window.location.search);
  document.getElementById('video-url').value = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  document.getElementById('legend-url').value = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  document.getElementById('title-input').value = params.get('title') ? decodeURIComponent(params.get('title')) : '';

  // Validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  // Play Video Button
  playVideoBtn.addEventListener('click', function () {
    const videoUrl = document.getElementById('video-url').value.trim();
    const legendUrl = document.getElementById('legend-url').value.trim();
    const legendFile = document.getElementById('legend-file').files[0];
    const title = document.getElementById('title-input').value.trim(); // New input

    if (!videoUrl || !isValidUrl(videoUrl)) {
      alert('Por favor, insira uma URL de vídeo válida.');
      return;
    }

    const encodedVideoUrl = encodeURIComponent(videoUrl);
    let redirectUrl = `player/?url=${encodedVideoUrl}`;

    if (urlOption.checked && legendUrl) {
      if (!isValidUrl(legendUrl)) {
        alert('Por favor, insira uma URL de legenda válida.');
        return;
      }
      redirectUrl += `&legend=${encodeURIComponent(legendUrl)}`;
    } else if (fileOption.checked && legendFile) {
      if (!legendFile.name.endsWith('.vtt')) {
        alert('Por favor, selecione um arquivo VTT válido.');
        return;
      }
      const blobUrl = URL.createObjectURL(legendFile);
      redirectUrl += `&legend=${encodeURIComponent(blobUrl)}`;
    }

    if (title) {
      redirectUrl += `&title=${encodeURIComponent(title)}`;
    }

    window.location.href = redirectUrl;
  });

  // Process TinyURL Button
  processTinyUrlBtn.addEventListener('click', async function () {
    const tinyUrlCode = document.getElementById('tinyurl-code').value.trim();
    const legendUrl = document.getElementById('legend-url').value.trim();
    const legendFile = document.getElementById('legend-file').files[0];
    const title = document.getElementById('title-input').value.trim();

    if (!tinyUrlCode) {
      alert('Por favor, insira um código TinyURL válido.');
      return;
    }

    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;
    const apiUrl = `https://helper-api-psi.vercel.app/unshort?url=${encodeURIComponent(tinyUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      const data = await response.json();
      if (!data.longUrl) throw new Error('A resposta da API não contém uma URL válida.');

      let redirectUrl = `player/?url=${encodeURIComponent(data.longUrl)}`;

      if (urlOption.checked && legendUrl) {
        if (!isValidUrl(legendUrl)) {
          alert('Por favor, insira uma URL de legenda válida.');
          return;
        }
        redirectUrl += `&legend=${encodeURIComponent(legendUrl)}`;
      } else if (fileOption.checked && legendFile) {
        if (!legendFile.name.endsWith('.vtt')) {
          alert('Por favor, selecione um arquivo VTT válido.');
          return;
        }
        const blobUrl = URL.createObjectURL(legendFile);
        redirectUrl += `&legend=${encodeURIComponent(blobUrl)}`;
      }

      if (title) {
        redirectUrl += `&title=${encodeURIComponent(title)}`;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Erro ao resolver a URL:', err);
      alert('Erro ao resolver a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
    }
  });
});