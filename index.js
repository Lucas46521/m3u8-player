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
  processTinyUrlBtn.addEventListener('click', function() {
    const tinyUrlCode = document.getElementById('tinyurl-code').value.trim();
    if (!tinyUrlCode) {
      alert('Por favor, insira um código TinyURL válido.');
      return;
    }

    // Montar o link TinyURL
    const tinyUrl = `https://tinyurl.com/${tinyUrlCode}`;
    console.log('Tentando resolver URL:', tinyUrl);

    // Resolver TinyURL diretamente com XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('GET', tinyUrl, true); // true para assíncrono
    xhr.setRequestHeader('Accept', '*/*'); // Evita possíveis restrições de tipo de conteúdo

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        const videoUrl = xhr.responseURL; // URL final após redirecionamentos
        console.log('URL resolvida:', videoUrl);

        // Redirecionar usando a URL resolvida como videoUrl
        const redirectUrl = `player/?url=${encodeURIComponent(videoUrl)}`;
        console.log('Redirecionando para:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error('Erro na resposta:', xhr.status, xhr.statusText);
        alert('Erro ao resolver a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
      }
    };

    xhr.onerror = function() {
      console.error('Erro na requisição:', xhr.statusText || 'Falha na conexão');
      alert('Erro ao resolver a URL. O link pode estar inválido, expirado ou bloqueado. Detalhes no console.');
    };

    xhr.send();
  });
});