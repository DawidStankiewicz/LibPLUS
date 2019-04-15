let popup = {
	setVersion: function () {
        let manifestData = chrome.runtime.getManifest();
        let version = manifestData.version;
        displayVersion: version;
    },

	displayVersion: function (version) {
        $(".version").text(version);
    }
}

window.onload = function setVersion() {

}