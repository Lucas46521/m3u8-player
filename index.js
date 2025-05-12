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
    const apiUrl = `https://unshort-api.vercel.app/?link=${encodeURIComponent(tinyUrl)}`;

    try {
      const response = await fetch(apiUrl, { method: 'POST' });
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      if (!data.success || !data.destination) throw new Error('A resposta da API não contém uma URL válida.');

      const redirectUrl = `player/?url=${encodeURIComponent(data.destination)}`;
      console.log('Redirecionando para:', redirectUrl);
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Erro ao resolver a URL:', err);
      alert('Erro ao resolver a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
    }
  });
});