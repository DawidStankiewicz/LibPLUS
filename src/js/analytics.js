module.exports = {
    init: function () {
        if (process.env.NODE_ENV === 'production') {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('meta')[0];
            s.parentNode.insertBefore(ga, s.nextSibling);

            window._gaq = window._gaq || [];
            _gaq.push(['_setAccount', process.env.GA_TRACKING_ID]);
            _gaq.push(['_trackPageview']);
            console.log('GA started')
        }

    }
}
