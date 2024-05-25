document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get('url') ? decodeURIComponent(params.get('url')) : '';
  const legendUrl = params.get('legend') ? decodeURIComponent(params.get('legend')) : '';
  const title = decodeURIComponent(params.get('title'));

  // Inicializa o player com configurações básicas
  var player = videojs('video-player', {
    responsive: true,
    autoplay: true,
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [{
      src: videoUrl,
      type: 'video/mp4'
    }],
    tracks: [{
      kind: 'captions',
      src: legendUrl,
      srclang: 'pt',
      label: 'custom'
    }]
  });

  // Verifica se o plugin httpSourceSelector está disponível
  if (typeof player.httpSourceSelector === 'function') {
    player.httpSourceSelector();
  } else {
    console.warn('httpSourceSelector plugin is not loaded.');
  }

  // Exibe o spinner de carregamento enquanto o vídeo está carregando
  player.on('waiting', function() {
    document.getElementById('loading-spinner').style.display = 'block';
  });

  // Oculta o spinner quando o vídeo pode ser reproduzido
  player.on('canplay', function() {
    document.getElementById('loading-spinner').style.display = 'none';
  });

  // Alterna a tela cheia ao clicar duas vezes
  const videoElement = document.getElementById('video-player');
  videoElement.addEventListener('dblclick', function() {
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  // Exibe uma mensagem de erro personalizada
  player.on('error', function() {
    const errorDisplay = player.errorDisplay;
    errorDisplay.open();
    errorDisplay.contentEl().innerHTML = 'Erro ao carregar o vídeo. Por favor, tente novamente mais tarde.';
  });

  // Define o título do vídeo, se disponível
  if (title) {
  document.getElementById('video-title').textContent = title;
}
  // Adiciona funcionalidade ao botão de mudo/desmudo
  const muteButton = document.createElement('button');
  muteButton.textContent = 'Mute';
  muteButton.className = 'vjs-mute-button';
  muteButton.onclick = function() {
    if (player.muted()) {
      player.muted(false);
      muteButton.textContent = 'Mute';
    } else {
      player.muted(true);
      muteButton.textContent = 'Unmute';
    }
  };
  player.controlBar.el().appendChild(muteButton);

  // Adiciona botões de avançar e retroceder 10 segundos
  const skipForwardButton = document.createElement('button');
  skipForwardButton.textContent = '>> 10s';
  skipForwardButton.className = 'vjs-skip-forward';
  skipForwardButton.onclick = function() {
    player.currentTime(player.currentTime() + 10);
  };
  player.controlBar.el().appendChild(skipForwardButton);

  const skipBackwardButton = document.createElement('button');
  skipBackwardButton.textContent = '<< 10s';
  skipBackwardButton.className = 'vjs-skip-backward';
  skipBackwardButton.onclick = function() {
    player.currentTime(player.currentTime() - 10);
  };
  player.controlBar.el().appendChild(skipBackwardButton);

  // Adiciona funcionalidade ao botão de velocidade
  const playbackRateButton = document.createElement('button');
  playbackRateButton.textContent = 'Velocidade';
  playbackRateButton.className = 'vjs-playback-rate-button';
  playbackRateButton.onclick = function() {
    player.playbackRate(player.playbackRate() + 0.5);
  };
  player.controlBar.el().appendChild(playbackRateButton);

  // Adiciona funcionalidade ao botão de legendas
  const captionsButton = document.createElement('button');
  captionsButton.textContent = 'Legendas';
  captionsButton.className = 'vjs-captions-button';
  captionsButton.onclick = function() {
    player.textTracks()[0].mode = (player.textTracks()[0].mode == 'showing' ? 'hidden' : 'showing');
  };
  player.controlBar.el().appendChild(captionsButton);
});