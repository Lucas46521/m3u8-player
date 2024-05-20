$(document).ready(function() {
    var video = document.getElementById('video');
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('subtitle')) {
        var subtitleLink = urlParams.get('subtitle');
        var track = document.createElement('track');
        track.kind = 'subtitles';
        track.src = subtitleLink;
        track.label = 'Portuguese'; // Defina o rótulo da legenda aqui
        video.appendChild(track);
    }

    if (urlParams.has('m3u8')) {
        var m3u8Link = urlParams.get('m3u8');
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(m3u8Link);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = m3u8Link;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }
    }
});