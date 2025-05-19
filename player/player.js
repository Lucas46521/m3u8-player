document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('video-player');
  const errorMessage = document.getElementById('error-message');
  const loadingScreen = document.getElementById('loading-screen');
  const titleElement = document.getElementById('video-title');

  // Verificar se o elemento de vídeo existe
  if (!videoElement) {
    console.error('Elemento de vídeo não encontrado.');
    errorMessage.textContent = 'Erro: Elemento de vídeo não encontrado.';
    errorMessage.style.display = 'block';
    loadingScreen.style.display = 'none';
    return;
  }

  // URLs padrão (fallback)
  const defaultVideoUrl = 'https://ee.netmagcdn.com:2228/hls-playback/82bf734769d5fc42cbb04fcba386ec83dfdef5500c18919f2e3b5727d7bf85bc34752661fb142ef8a8825db28343d1bd836447e9c6599ec5f05ca2e4f125ad918930ab7390bd569561267369f91c992e453a54a58e7d42455b8612c5ab606ccf85768d5e2c3824d8fba92493ddcf7a8e9b4a1b3121d3c7c6b0a27d651c97b40ce95a6bc1939860cdb6df62498ee2c255/master.m3u8';
  const defaultSubtitleUrl = 'https://s.megastatics.com/subtitle/26ce8eb12be95647387de654ba45c11e/por-4.vtt';
  const defaultTitle = 'Video Player';

  // Ler parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = urlParams.get('video') ? decodeURIComponent(urlParams.get('video')) : defaultVideoUrl;
  const subtitleUrl = urlParams.get('subtitle') ? decodeURIComponent(urlParams.get('subtitle')) : defaultSubtitleUrl;
  const title = urlParams.get('title') ? decodeURIComponent(urlParams.get('title')) : defaultTitle;

  // Atualizar título
  titleElement.textContent = title;

  // Configurar o player
  const player = videojs('video-player', {
    fluid: true,
    responsive: true,
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }],
    tracks: subtitleUrl ? [{
      kind: 'subtitles',
      src: subtitleUrl,
      srclang: 'pt',
      label: 'Português',
      default: true
    }] : [],
    html5: {
      vhs: {
        overrideNative: !videojs.browser.IS_SAFARI // Não sobrescrever no Safari, que suporta HLS nativamente
      }
    }
  });

  // Esconder tela de carregamento quando o vídeo estiver pronto
  player.on('loadedmetadata', () => {
    loadingScreen.style.display = 'none';
  });

  // Tratar erros
  player.on('error', () => {
    const error = player.error();
    console.error('Erro no player:', error);
    errorMessage.textContent = error.message || 'Erro ao carregar o vídeo. Verifique a URL ou tente novamente.';
    errorMessage.style.display = 'block';
    loadingScreen.style.display = 'none';
  });

  // Iniciar reprodução automaticamente (opcional)
  player.ready(() => {
    player.play().catch(err => {
      console.warn('Reprodução automática bloqueada:', err);
    });
  });
});