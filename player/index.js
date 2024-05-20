document.addEventListener('DOMContentLoaded', function() {
      const player = new Plyr('#player');

      const params = new URLSearchParams(window.location.search);
      const videoUrl = decodeURIComponent(params.get('url'));
      const legendUrl = decodeURIComponent(params.get('legend'));

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
      }
    });