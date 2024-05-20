$(window).on('load', function () {
    $('#m3u8-placeholder')[0].value = localStorage.getItem('m3u8-link') || '';
    $('#play-btn').on('click', function () {
        localStorage.setItem('m3u8-link', $('#m3u8-placeholder')[0].value);
        window.location.href = './player' + '#' + $('#m3u8-placeholder')[0].value;
    });

    // Adicione esta parte para lidar com a legenda
    $('#submit-subtitle-btn').on('click', function () {
        var subtitleLink = $('#subtitle-placeholder').val();
        // Se um link de legenda for fornecido, adicione-o ao vídeo
        if (subtitleLink) {
            var video = document.getElementById('video');
            var track = document.createElement('track');
            track.kind = 'subtitles';
            track.src = subtitleLink;
            track.label = 'Portuguese'; // Defina o rótulo da legenda aqui
            video.appendChild(track);
        }
    });
});