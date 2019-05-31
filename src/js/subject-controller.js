const gradeUtilities = require("./grade-utils");

let subjects;

const subjectController = {
    initSubjectDataContainers: function () {
        subjects = JSON.parse(sessionStorage.getItem('LIBPLUS_SUBJECTS'));
        if (!subjects) {
            return;
        }
        subjects.forEach(subject => {
            let firstTermContainer = $(`#subject-${subject.id} td:nth-child(4)`);
            let secondTermContainer = $(`#subject-${subject.id} td:nth-child(8)`);
            let allTermContainer = $(`#subject-${subject.id} td:nth-child(10)`);
            firstTermContainer[0].id = `subject-${subject.id}-gpa-term-1`;
            secondTermContainer[0].id = `subject-${subject.id}-gpa-term-2`;
            allTermContainer[0].id = `subject-${subject.id}-gpa-term-all`;
        })
    },
    showSubjectsData: function () {
        const grades = JSON.parse(sessionStorage.getItem('LIBPLUS_GRADES'));
        subjects.forEach(subject => {
            const subjectGrades = grades.filter(grade => Number(grade.subject.id) === Number(subject.id));
            const firstTermGrades = subjectGrades.filter(grade => grade.term === 1);
            const secondTermGrades = subjectGrades.filter(grade => grade.term === 2);

            const data = {
                subjectGpa: gradeUtilities.calcGradePointAverage(subjectGrades),
                firstTermGpa: gradeUtilities.calcGradePointAverage(firstTermGrades),
                secondTermGpa: gradeUtilities.calcGradePointAverage(secondTermGrades),
                firstTermGradesNumber: firstTermGrades.length,
                secondTermGradesNumber: secondTermGrades.length
            }
            this.updateContainers(subject, data);
        })
    },
    updateContainers: function (subject, data) {
        const firstTermTitle = `Średnia z ${data.firstTermGradesNumber} ocen w I semestrze obliczona dzięki rozszerzeniu LibPlus`;
        const secondTermTitle = `Średnia z ${data.secondTermGradesNumber} ocen w II semestrze obliczona dzięki rozszerzeniu LibPlus`;
        const allTitle = `Średnia z ${data.firstTermGradesNumber + data.secondTermGradesNumber} ocen obliczona dzięki rozszerzeniu LibPlus`;
        const firstTermContainer = `<span title="${firstTermTitle}">${data.firstTermGpa}</span>`;
        const secondTermContainer = `<span title="${secondTermTitle}">${data.secondTermGpa}</span>`;
        const allContainer = `<span title="${allTitle}">${data.subjectGpa}</span>`;
        $(`#subject-${subject.id}-gpa-term-1`).html(firstTermContainer);
        $(`#subject-${subject.id}-gpa-term-2`).html(secondTermContainer);
        $(`#subject-${subject.id}-gpa-term-all`).html(allContainer);
    }
}

module.exports = subjectController;
