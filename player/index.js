document.addEventListener('DOMContentLoaded', function() {
  const validateURLs = (videoUrl, legendUrl) => {
    const isValidURL = (url) => {
      const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
      return pattern.test(url);
    };

    const isVTT = (url) => {
      return url.toLowerCase().endsWith('.vtt');
    };

    if (!isValidURL(videoUrl)) {
      throw new Error("URL do vídeo inválido");
    }

    if (!isValidURL(legendUrl)) {
      throw new Error("URL da legenda inválido");
    }

    if (!isVTT(legendUrl)) {
      throw new Error("URL da legenda deve terminar com .vtt");
    }
  };

  const player = new Plyr('#video-player', {
    autoplay: true,
    captions: { active: true, update: true, language: 'ct' },
    keyboard: { focused: true, global: true },
    tooltips: { controls: true },
    controls: [
      'play-large', 
      'play', 
      'progress', 
      'current-time', 
      'mute', 
      'volume', 
      'captions', 
      'settings', 
      'pip',
      'airplay', 
      'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
  });

  const params = new URLSearchParams(window.location.search);
  const videoUrl = decodeURIComponent(params.get('url'));
  const legendUrl = decodeURIComponent(params.get('legend'));

  try {
    validateURLs(videoUrl, legendUrl);

    player.source = {
      type: 'video',
      sources: [
        {
          src: videoUrl,
          type: 'video/mp4',
        },
      ],
      tracks: [
        {
          kind: 'captions',
          label: 'Custom',
          srclang: 'ct',
          src: legendUrl,
          default: true,
        },
      ],
    };

    const fullURL = window.location.href;
    const responseData = {
      videoUrl: videoUrl,
      legendUrl: legendUrl,
      fullURL: fullURL
    };

    // Retornando a resposta JSON
    window.location.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(responseData));
  } catch (error) {
    const errorResponse = {
      error: error.message
    };

    // Retornando a resposta JSON
    window.location.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(errorResponse));
    // Aqui você pode lidar com o erro, talvez retornando um JSON de erro para o cliente
  }

  window.addEventListener('orientationchange', () => {
    player.play();
  });

  document.addEventListener('fullscreenchange', () => {
    player.play();
  });
});