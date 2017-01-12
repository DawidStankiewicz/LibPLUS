window.onload = function setVersion() {
	let manifestData = chrome.runtime.getManifest();
	let version = manifestData.version;
	$(".version").text(version);
}