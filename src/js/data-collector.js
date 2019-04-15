const $ = require("jquery");
const {gradeId, selectors} = require('./patterns.js');

const dataCollector = {
    getSubjects: function () {
        let subjects = [];
        $(selectors.rowsWithGrades + ' > ' + selectors.subjectNameRow)
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
        $(selectors.gradeBox).toArray().filter((raw, id) => id != 0).forEach((raw, id) => {
            raw.id = gradeId(id);
            grades.push({
                id,
                html: raw.innerHTML
            });
        })
        return grades;
    },
    initSelectors: function () {
        let gradesTable = $(selectors.gradesTable)
            .toArray().filter(t => t.innerHTML.indexOf(selectors.testGrade) === -1)[0];
        gradesTable.id = 'grades';
    },
}

module.exports = dataCollector;
