let libplusVersion;

window.onload = function setVersion() {
	let manifestData = chrome.runtime.getManifest();
	libplusVersion = manifestData.version;
	$(".version").text(libplusVersion);

	initGA();
}

function initGA() {
	var buttons = document.querySelectorAll('.ga');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', trackButtonClick);
	}
}

function trackButtonClick(e) {
	const id = e.target.id;
	_gaq.push(['_trackEvent', id, 'clicked', libplusVersion]);
};
