$(document).ready(function(){
    var video = document.getElementById('video');

    // Função para adicionar legenda ao vídeo
    function addSubtitle(subtitleUrl){
        var track = document.createElement('track');
        track.src = subtitleUrl;
        track.kind = 'subtitles';
        track.label = 'Português'; // Altere conforme necessário
        track.srclang = 'pt'; // Altere conforme necessário
        video.appendChild(track);
    }

    // Verifique se há um URL de legenda na URL da página
    var urlParams = new URLSearchParams(window.location.search);
    var subtitleUrl = urlParams.get('subtitle');

    // Se houver um URL de legenda, adicione-o ao vídeo
    if(subtitleUrl){
        addSubtitle(subtitleUrl);
    }

    // Obtenha o URL do vídeo da URL da página e reproduza-o
    var videoUrl = urlParams.get('video');
    if(videoUrl){
        playM3u8(videoUrl);
    }

    // Função para reproduzir o vídeo .m3u8
    function playM3u8(url){
        if(Hls.isSupported()) {
            var hls = new Hls();
            var m3u8Url = decodeURIComponent(url);
            hls.loadSource(m3u8Url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
            document.title = url;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('canplay',function() {
                video.play();
            });
            document.title = url;
        }
    }

    // Ação do botão de enviar legenda
    $('#submit-subtitle-btn').on('click', function(){
        var subtitleUrl = $('#subtitle-placeholder').val();
        addSubtitle(subtitleUrl);
    });
});