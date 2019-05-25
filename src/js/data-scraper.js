const $ = require("jquery");
const {gradeId, selectors} = require('./patterns.js');

const dataScraper = {
    getData(sourcePage) {
        dataScraper.sourcePage = sourcePage;
        dataScraper.initSelectors();

        const subjects = this.getSubjects();
        const grades = this.getGrades();

        return {
            subjects,
            grades
        }
    },
    getSubjects() {
        let subjects = [];
        $(this.sourcePage).find(selectors.rowsWithGrades + ' > ' + selectors.subjectNameRow)
            .toArray().forEach((rawName, id) => {
            rawName.parentElement.id = 'subject-' + id;
            subjects.push({
                id,
                name: rawName.innerText,
            })
        })
        return subjects;
    },
    getGrades() {
        let grades = [];
        $(this.sourcePage).find(selectors.gradeBox).toArray().filter((raw, id) => id != 0).forEach((raw, id) => {
            raw.id = gradeId(id);
            grades.push({
                id,
                html: raw.innerHTML
            });
        })
        return grades;
    },
    initSelectors() {
        let gradesTable = $(dataScraper.sourcePage).find(selectors.gradesTable)
            .toArray().filter(t => t.innerHTML.indexOf(selectors.testGrade) === -1)[0];
        if (gradesTable) {
            gradesTable.id = 'grades';
        } else {
            throw new Error('table not found!');
        }
    },
    setSourcePage(sourcePage) {
        this.sourcePage = sourcePage;
    }
}

module.exports = dataScraper;
