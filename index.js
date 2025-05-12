document.addEventListener('DOMContentLoaded', function() {
  const playVideoBtn = document.getElementById('play-video');
  const processTinyUrlBtn = document.getElementById('process-tinyurl');

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

    // Montar o link TinyURL
    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;
    console.log('Desencurtando URL:', tinyUrl);

    // Tentar com fetch primeiro
    try {
      console.log('Tentando fetch:', tinyUrl);
      const response = await fetch(tinyUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      const videoUrl = response.url;
      console.log('URL desencurtada (fetch):', videoUrl);

      // Redirecionar usando a URL desencurtada como videoUrl
      const redirectUrl = `player/?url=${encodeURIComponent(videoUrl)}`;
      console.log('Redirecionando para:', redirectUrl);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Erro no fetch:', error.message || error);

      // Fallback para unshorten.me
      try {
        console.log('Tentando unshorten.me:', tinyUrl);
        const response = await fetch(`https://unshorten.me/api/v1/unshorten?url=${encodeURIComponent(tinyUrl)}`);
        const data = await response.json();
        if (data.resolved_url) {
          const videoUrl = data.resolved_url;
          console.log('URL desencurtada (unshorten.me):', videoUrl);

          // Redirecionar usando a URL desencurtada como videoUrl
          const redirectUrl = `player/?url=${encodeURIComponent(videoUrl)}`;
          console.log('Redirecionando para:', redirectUrl);
          window.location.href = redirectUrl;
        } else {
          throw new Error('unshorten.me não retornou uma URL válida');
        }
      } catch (error) {
        console.error('Erro no unshorten.me:', error.message || error);
        alert('Erro ao desencurtar a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
      }
    }
  });
});