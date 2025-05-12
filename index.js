document.addEventListener('DOMContentLoaded', function() {
  const playVideoBtn = document.getElementById('play-video');
  const processTinyUrlBtn = document.getElementById('process-tinyurl');

  // Função para desencurtar URLs TinyURL
  async function unshortenCode(tinyUrlCode) {
    try {
      console.log('Desencurtando código:', tinyUrlCode);
      const response = await fetch("https://tinyurl.com/" + tinyUrlCode, {
        method: 'GET', // Usa GET para contornar restrições de HEAD
        redirect: 'follow'
      });
      console.log('URL desencurtada:', response.url);
      return response.url;
    } catch (error) {
      console.error('Erro ao desencurtar:', error.message || error);
      alert('Erro ao desencurtar a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
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

    // Desencurtar a URL usando o código
    const videoUrl = await unshortenCode(tinyUrlCode);
    if (!videoUrl) {
      return; // Erro já tratado na função unshortenCode
    }

    // Redirecionar usando a URL desencurtada como videoUrl
    const redirectUrl = `player/?url=${encodeURIComponent(videoUrl)}`;
    console.log('Redirecionando para:', redirectUrl);
    window.location.href = redirectUrl;
  });
});