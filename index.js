document.addEventListener('DOMContentLoaded', function() {
  const playVideoBtn = document.getElementById('play-video');
  const processTinyUrlBtn = document.getElementById('process-tinyurl');

  // Função para desencurtar URLs no navegador
  async function unshortenUrl(shortUrl) {
    try {
      const response = await fetch(shortUrl, {
        method: 'HEAD', // Usa HEAD para evitar baixar conteúdo
        redirect: 'follow' // Segue redirecionamentos
      });
      return response.url;
    } catch (error) {
      console.error('Erro ao desencurtar:', error);
      alert('Erro ao desencurtar a URL. Verifique o código ou tente novamente.');
      return null;
    }
  }

  // Evento para o botão "Reproduzir"
  playVideoBtn.addEventListener('click', function() {
    const videoUrl = encodeURIComponent(document.getElementById('video-url').value);
    const legendUrl = encodeURIComponent(document.getElementById('legend-url').value);
    const legendFile = document.getElementById('legend-file').files[0];

    let legendParam = '';

    if (legendUrl) {
      legendParam = `&legend=${legendUrl}`;
    } else if (legendFile) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const legendData = event.target.result;
        const legendDataEncoded = encodeURIComponent(legendData);
        window.location.href = `player/?url=${videoUrl}&legend=${legendDataEncoded}`;
      };
      reader.readAsDataURL(legendFile);
      return; // Impede execução adicional
    }

    // Redirecionar para a página do player
    window.location.href = `player/?url=${videoUrl}${legendParam}`;
  });

  // Evento para o botão "Processar TinyURL"
  processTinyUrlBtn.addEventListener('click', async function() {
    const tinyUrlCode = document.getElementById('tinyurl-code').value.trim();
    if (!tinyUrlCode) {
      alert('Por favor, insira um código TinyURL válido.');
      return;
    }

    // Construir o link TinyURL
    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;

    // Desencurtar a URL
    const originalUrl = await unshortenUrl(tinyUrl);
    if (!originalUrl) {
      return; // Erro já tratado na função unshortenUrl
    }

    // Extrair parâmetros url e legend
    const urlObj = new URL(originalUrl);
    const videoUrl = urlObj.searchParams.get('url');
    const legendUrl = urlObj.searchParams.get('legend');

    if (!videoUrl) {
      alert('A URL desencurtada não contém o parâmetro "url".');
      return;
    }

    // Construir a URL de redirecionamento
    const redirectUrl = `player/?url=${encodeURIComponent(videoUrl)}${legendUrl ? `&legend=${encodeURIComponent(legendUrl)}` : ''}`;
    window.location.href = redirectUrl;
  });
});