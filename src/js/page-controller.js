require('../css/libplus-page');
const libplusController = require('./libplus-controller');

const containerId = 'Libplus';
const containerWrapperClass = 'Libplus__page-wrapper';

const pageController = {
    init() {
        const container = `<div class="${containerWrapperClass}"><div id="${containerId}"></div></div>`;
        const containerNeighbour = $('#grades').siblings().closest('h3.center');
        $(container).insertBefore(containerNeighbour);

        libplusController.init();
    }
}


module.exports = pageController;
