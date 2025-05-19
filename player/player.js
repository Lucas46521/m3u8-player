document.addEventListener('DOMContentLoaded', () => {
  // URLs padrão (fallback)
  const defaultVideoUrl = 'https://ee.netmagcdn.com:2228/hls-playback/82bf734769d5fc42cbb04fcba386ec83dfdef5500c18919f2e3b5727d7bf85bc34752661fb142ef8a8825db28343d1bd836447e9c6599ec5f05ca2e4f125ad918930ab7390bd569561267369f91c992e453a54a58e7d42455b8612c5ab606ccf85768d5e2c3824d8fba92493ddcf7a8e9b4a1b3121d3c7c6b0a27d651c97b40ce95a6bc1939860cdb6df62498ee2c255/master.m3u8';
  const defaultSubtitleUrl = 'https://s.megastatics.com/subtitle/26ce8eb12be95647387de654ba45c11e/por-4.vtt';

  // Ler parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = urlParams.get('video') || defaultVideoUrl;
  const subtitleUrl = urlParams.get('subtitle') || defaultSubtitleUrl;

  // Configurar o elemento de vídeo
  const videoElement = document.getElementById('video-player');
  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = 'application/x-mpegURL';
  videoElement.appendChild(source);

  const track = document.createElement('track');
  track.kind = 'subtitles';
  track.src = subtitleUrl;
  track.srclang = 'pt';
  track.label = 'Português';
  track.default = true;
  videoElement.appendChild(track);

  // Inicializar o player
  const player = videojs('video-player', {
    responsive: true,
    playbackRates: [0.5, 1, 1.5, 2],
    html5: {
      hls: {
        overrideNative: true
      }
    },
    plugins: {
      maxQualitySelector: {}
    }
  });

  // Esconder a tela de carregamento quando o vídeo estiver pronto
  player.on('loadedmetadata', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  });

  // Exibir mensagem de erro em caso de falha
  player.on('error', () => {
    console.error('Erro no player:', player.error());
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Erro ao carregar o vídeo. Verifique a URL ou tente novamente.';
    errorMessage.style.display = 'block';
    document.getElementById('loading-screen').style.display = 'none';
  });
});
