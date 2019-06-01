const dataScraper = require('./data-scraper.js');
const gradeParser = require('./grade-parser.js');
const pageController = require('./page-controller.js');
const subjectController = require('./subject-controller.js');

const libplus = {
    init: function () {
        const scrapedData = dataScraper.getData(document);
        gradeParser.init(document);
        const grades = gradeParser.parseAll(scrapedData.grades);
        sessionStorage.setItem('LIBPLUS_GRADES', JSON.stringify(grades));
        sessionStorage.setItem('LIBPLUS_SUBJECTS', JSON.stringify(scrapedData.subjects));
        subjectController.initSubjectDataContainers();
        subjectController.showSubjectsData();
        pageController.init();
    },
};

module.exports = libplus;

window.onload = libplus.init();
