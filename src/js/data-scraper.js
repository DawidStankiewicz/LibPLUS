const $ = require("jquery");
const {gradeId, selectors} = require('./patterns.js');

const dataScraper = {
    getSubjects: function () {
        let subjects = [];
        $(this.page).find(selectors.rowsWithGrades + ' > ' + selectors.subjectNameRow)
            .toArray().forEach((rawName, id) => {
            rawName.parentElement.id = 'subject-' + id;
            subjects.push({
                id,
                name: rawName.innerText,
            })
        })
        return subjects;
    },
    getGrades: function () {
        let grades = [];
        $(this.page).find(selectors.gradeBox).toArray().filter((raw, id) => id != 0).forEach((raw, id) => {
            raw.id = gradeId(id);
            grades.push({
                id,
                html: raw.innerHTML
            });
        })
        return grades;
    },
    initSelectors: function (page) {
        this.page = page;
        let gradesTable = $(this.page).find(selectors.gradesTable)
            .toArray().filter(t => t.innerHTML.indexOf(selectors.testGrade) === -1)[0];
        if (gradesTable) {
            gradesTable.id = 'grades';
        }
        return this.page;
    },
}

module.exports = dataScraper;
