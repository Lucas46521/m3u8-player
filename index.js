document.addEventListener('DOMContentLoaded', function() {
  const urlOption = document.getElementById('url-option');
  const fileOption = document.getElementById('file-option');
  const legendUrlInput = document.getElementById('legend-url');
  const legendFileInput = document.getElementById('legend-file');

  // Função para alternar entre URL e arquivo de legenda
  function toggleLegendInput() {
    if (urlOption.checked) {
      legendUrlInput.style.display = 'inline-block';
      legendFileInput.style.display = 'none';
    } else if (fileOption.checked) {
      legendUrlInput.style.display = 'none';
      legendFileInput.style.display = 'inline-block';
    }
  }

  // Adiciona evento de mudança aos botões de opção
  urlOption.addEventListener('change', toggleLegendInput);
  fileOption.addEventListener('change', toggleLegendInput);

  // Adiciona evento de clique ao botão de alternar legenda
  const toggleLegendBtn = document.getElementById('toggle-legend');
  toggleLegendBtn.addEventListener('click', function() {
    if (urlOption.checked) {
      fileOption.checked = true;
    } else if (fileOption.checked) {
      urlOption.checked = true;
    }
    toggleLegendInput();
  });

  // Adiciona evento de clique ao botão de reproduzir
  const playVideoBtn = document.getElementById('play-video');
  playVideoBtn.addEventListener('click', function() {
    const videoUrl = document.getElementById('video-url').value;
    const legendUrl = legendUrlInput.value;
    const legendFile = legendFileInput.files[0];

    // Adicionar lógica para reproduzir vídeo com a URL e legenda especificadas
    // Por enquanto, apenas exibe os valores no console
    console.log('URL do vídeo:', videoUrl);
    console.log('URL da legenda:', legendUrl);
    console.log('Arquivo da legenda:', legendFile);
  });
});