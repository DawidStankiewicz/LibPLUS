require("../css/popup.css");
const $ = require('jquery');

(function() {
    console.log(`NODE ENV: ${process.env.NODE_ENV}`);

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-138677716-1';
    var s = document.getElementsByTagName('meta')[0];
    s.parentNode.insertBefore(ga, s.nextSibling);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-138677716-1');

    $(window).click(function () {
        console.log('clicked in popup');
        gtag('event', 'popup_click', {
            'event_callback': function() {
                console.log('event sent');

            }
        });
    })
})();
