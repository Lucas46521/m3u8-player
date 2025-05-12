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
      reader.onerror = function () {
        alert('Erro ao ler o arquivo de legenda.');
      };
      reader.readAsDataURL(legendFile);
      return;
    }

    window.location.href = `player/?url=${videoUrl}${legendParam}`;
  });

  async function resolveViaIframe(tinyUrl) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = tinyUrl;

      iframe.onload = () => {
        try {
          const resolvedUrl = iframe.contentWindow.location.href;
          resolve(resolvedUrl);
        } catch (err) {
          reject('Não foi possível acessar o redirecionamento (CORS).');
        } finally {
          document.body.removeChild(iframe);
        }
      };

      iframe.onerror = () => {
        reject('Erro ao carregar o iframe.');
        document.body.removeChild(iframe);
      };

      document.body.appendChild(iframe);
    });
  }

  processTinyUrlBtn.addEventListener('click', async function () {
    const tinyUrlCode = document.getElementById('tinyurl-code').value.trim();
    if (!tinyUrlCode) {
      alert('Por favor, insira um código TinyURL válido.');
      return;
    }

    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;

    try {
      const resolvedUrl = await resolveViaIframe(tinyUrl);
      window.location.href = `player/?url=${encodeURIComponent(resolvedUrl)}`;
    } catch (err) {
      console.error(err);
      alert('Erro ao resolver o link TinyURL. Detalhes no console.');
    }
  });
});