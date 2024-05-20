$(window).on('load', function () {
    $('#m3u8-placeholder')[0].value = localStorage.getItem('m3u8-link') || '';
    $('#play-btn').on('click', function () {
        localStorage.setItem('m3u8-link', $('#m3u8-placeholder')[0].value);
        
        // Obtenha o link da legenda, se fornecido
        var subtitleLink = $('#legenda-placeholder').val();
        var url = './player' + '#' + $('#m3u8-placeholder')[0].value;

        // Se um link de legenda for fornecido, adicione-o à URL
        if (subtitleLink) {
            url += '&subtitle=' + subtitleLink;
        }

        window.location.href = url;
    });
});