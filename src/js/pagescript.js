const dataCollector = require('./data-collector.js');
const gradeParser = require('./grade-parser.js');

const libplus = {
    init: function () {
        dataCollector.initSelectors();
        this.subjects = dataCollector.getSubjects();
        const grades = dataCollector.getGrades();
        this.grades = gradeParser.parseAll(grades);
    }
}

module.exports = libplus;

window.onload = libplus.init();
