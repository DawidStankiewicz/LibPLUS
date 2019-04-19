const dataCollector = require('./data-collector.js');
const gradeParser = require('./grade-parser.js');
const pageController = require('./page-controller.js');
const subjectController = require('./subject-controller.js');

const libplus = {
    init: function () {
        dataCollector.initSelectors();
        this.subjects = dataCollector.getSubjects();
        const grades = dataCollector.getGrades();
        this.grades = gradeParser.parseAll(grades);
        sessionStorage.setItem('LIBPLUS_GRADES', JSON.stringify(this.grades));
        sessionStorage.setItem('LIBPLUS_SUBJECTS', JSON.stringify(this.subjects));
        subjectController.initSubjectDataContainers();
        subjectController.showSubjectsData();
        pageController.init();
    },
}

module.exports = libplus;

window.onload = libplus.init();
