(function() {
    function identifySite() {
        if (window.location.hostname.indexOf('imdb') !== -1) return 'imdb';
        if (window.location.hostname.indexOf('letterboxd') !== -1) return 'letterboxd';
        if (window.location.hostname.indexOf('google') !== -1) return 'google';
        if (window.location.hostname.indexOf('trakt') !== -1) return 'trakt';
    }

    function collectInfo() {
        let host = identifySite();
        if (host === 'imdb') {
            const imdb = 'tt' + window.location.href.split('/tt')[1].split('/')[0];
            return { host, imdb, mediaType: 'movie' };
        } else if (host === 'letterboxd') {
            let splitLink = document.querySelector('a.micro-button[data-track-action="IMDb"]').getAttribute('href').split('/')
            return splitLink[splitLink.length-2];
        } else if (host === 'google') {
            let IMDBLink = document.querySelector('[title="IMDb"]').parentElement.getAttribute('href');
            return 'tt' + IMDBLink.split('/tt')[1].split('/')[0];
        } else if (host === 'trakt') {
            const isShow = window.location.pathname.indexOf('seasons') === -1;
            const isEpisode = window.location.pathname.indexOf('episodes') !== -1;
            const isSeason = !isShow && !isEpisode;
            console.log(isShow, isEpisode, isSeason);
            if (isShow || isSeason) {
                const links = document.querySelectorAll('ul.external li a');
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    if (link.innerHTML === 'IMDB') {
                        console.log('yes')
                        let IMDBLink = link.getAttribute('href');
                        let imdb = 'tt' + IMDBLink.split('/tt')[1].split('/')[0];
                        console.log({ host, imdb, mediaType: 'show' });
                        return { host, imdb, mediaType: 'show' };
                    }
                }
            } else if (isEpisode) {
                let show = window.location.href.split('shows/')[1].split('/')[0];
                let season = window.location.href.split('seasons/')[1].split('/')[0];
                let episode = window.location.href.split('episodes/')[1].split('/')[0];
                if (season.length === 1) season = '0' + season;
                if (episode.length === 1) episode = '0' + episode;
                return { host, show, season, episode, mediaType: 'episode' };
            }
        }
    }

    const info = collectInfo();
    console.log(info);
    openTab(info);

    function openTab(info) {
        if (info.mediaType === 'movie') {
            const rarbgLink = 'https://rarbgproxy.org/torrents.php?category=14;48;17;44;45;47;50;51;52;42;46&search={IMDB_ID}&order=seeders&by=DESC';
            window.open(rarbgLink.replace('{IMDB_ID}', info.imdb), '_blank');
        } else if (info.mediaType === 'show') {
            window.open(`https://rarbgproxy.org/tv/${info.imdb}/`);
        } else if (info.mediaType === 'episode') {
            const query = `${info.show} s${info.season}e${info.episode}`;
            const rarbgLink = `https://rarbgproxy.org/torrents.php?search=${query}&category=2;18;41;49&order=seeders&by=DESC`;
            window.open(rarbgLink, '_blank');
        }
    }

})();
