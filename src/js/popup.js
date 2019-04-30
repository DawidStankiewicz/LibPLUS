require("./analytics").init();
require("../css/popup.css");
const appVersion = chrome.runtime.getManifest().version;

window.onload = function () {
    document.querySelector('.version').innerText = appVersion;
    const buttons = document.querySelectorAll('.Libplus__ga-item');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', trackButtonClick);
    }
}

function trackButtonClick(e) {
    const id = e.target.id;
    _gaq.push(['_trackEvent', id, 'clicked', appVersion]);
};
