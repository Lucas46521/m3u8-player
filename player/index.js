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
  const title = decodeURIComponent(params.get('title'));

  try {
    validateURLs(videoUrl, legendUrl);

    if (title) {
      // Se houver um título, exiba-o acima do vídeo
      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      document.body.insertBefore(titleElement, document.getElementById('video-player'));
    }

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
  } catch (error) {
    // Retorna um JSON em caso de erro
    return res.status(400).json({ error: error.message });
  }

  window.addEventListener('orientationchange', () => {
    player.play();
  });

  document.addEventListener('fullscreenchange', () => {
    player.play();
  });
});