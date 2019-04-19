const dataCollector = require('./data-collector.js');
const gradeParser = require('./grade-parser.js');
const pageController = require('./page-controller.js');

const libplus = {
    init: function () {
        dataCollector.initSelectors();
        this.subjects = dataCollector.getSubjects();
        const grades = dataCollector.getGrades();
        this.grades = gradeParser.parseAll(grades);
        sessionStorage.setItem('LIBPLUS_GRADES', JSON.stringify(this.grades));
        pageController.init();
    },
}

module.exports = libplus;

window.onload = libplus.init();
