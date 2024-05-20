function validateURLs(videoUrl, legendUrl) {
  const isValidURL = (url) => {
    const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
    return pattern.test(url);
  };

  const isVTT = (url) => {
    return url.toLowerCase().endsWith('.vtt');
  };

  if (!isValidURL(videoUrl)) {
    return { error: "URL do vídeo inválido" };
  }

  if (!isValidURL(legendUrl)) {
    return { error: "URL da legenda inválido" };
  }

  if (!isVTT(legendUrl)) {
    return { error: "URL da legenda deve terminar com .vtt" };
  }

  return { success: true };
}

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = decodeURIComponent(params.get('url'));
  const legendUrl = decodeURIComponent(params.get('legend'));

  const validationResult = validateURLs(videoUrl, legendUrl);

  if (validationResult.error) {
    console.error(validationResult.error);
    // Aqui você pode lidar com o erro, talvez exibindo uma mensagem para o usuário
  } else {
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

    if (videoUrl) {
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
    } else {
      player.source = {
        type: 'video',
        sources: [
          {
            src: 'https://www.youtube.com/embed/NcQQVbioeZk',
            type: 'video/mp4',
          },
        ],
      };
    }

    window.addEventListener('orientationchange', () => {
      player.play();
    });

    document.addEventListener('fullscreenchange', () => {
      player.play();
    });
  }
});