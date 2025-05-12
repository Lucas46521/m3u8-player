document.addEventListener('DOMContentLoaded', function () {
  const playVideoBtn = document.getElementById('play-video');
  const processTinyUrlBtn = document.getElementById('process-tinyurl');

  playVideoBtn.addEventListener('click', function () {
    const videoUrl = encodeURIComponent(document.getElementById('video-url').value);
    const legendUrl = encodeURIComponent(document.getElementById('legend-url').value);
    const legendFile = document.getElementById('legend-file').files[0];

    let legendParam = '';

    if (legendUrl) {
      legendParam = `&legend=${legendUrl}`;
    } else if (legendFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const legendData = event.target.result;
        const legendDataEncoded = encodeURIComponent(legendData);
        window.location.href = `player/?url=${videoUrl}&legend=${legendDataEncoded}`;
      };
      reader.readAsDataURL(legendFile);
      return;
    }

    window.location.href = `player/?url=${videoUrl}${legendParam}`;
  });

  processTinyUrlBtn.addEventListener('click', async function () {
    const tinyUrlCode = document.getElementById('tinyurl-code').value.trim();
    if (!tinyUrlCode) {
      alert('Por favor, insira um código TinyURL válido.');
      return;
    }

    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;
    console.log('Tentando resolver URL:', tinyUrl);

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(tinyUrl)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      // A URL final pode estar nos headers ou conteúdo da página, então assumimos que ela está no location final
      const finalUrl = response.url;
      console.log('URL resolvida:', finalUrl);

      const redirectUrl = `player/?url=${encodeURIComponent(finalUrl)}`;
      console.log('Redirecionando para:', redirectUrl);
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Erro ao resolver a URL:', err);
      alert('Erro ao resolver a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
    }
  });
});