const {gradeId, selectors} = require('./patterns.js');

const dataScraper = {
    getData(sourcePage) {
        dataScraper.sourcePage = sourcePage;
        dataScraper.initSelectors();
        return {
            subjects: dataScraper.getSubjects(),
            grades: dataScraper.getGrades(),
            user: dataScraper.getUser(),
            events: dataScraper.getNotificationsNumber(selectors.timetableNotifications),
            messages: dataScraper.getNotificationsNumber(selectors.messagesNotifications),
            announcements: dataScraper.getNotificationsNumber(selectors.announcementsNotifications),
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
        });
        return subjects;
    },
    getGrades() {
        let grades = [];
        $(this.sourcePage).find(selectors.gradeBox).toArray()
            .filter((raw, id) => id !== 0)
            .forEach((raw, id) => {
            raw.id = gradeId(id);
            grades.push({
                id,
                html: raw.innerHTML
            });
        });
        return grades;
    },
    getUser() {
        const rawUsername = $(dataScraper.sourcePage).find(selectors.username).parent().text();
        return rawUsername.substring(0, rawUsername.indexOf('Klasa:'))
            .replace('Uczeń: ', '');
    },
    getNotificationsNumber(selector) {
        const notification = $(dataScraper.sourcePage)
            .find(selector);
        if (!notification.length) {
            return 0;
        }
        const number = notification.attr('title').match(/\d/);
        return number ? Number(number[0]) : 0;
    },
    initSelectors() {
        let gradesTable = $(dataScraper.sourcePage).find(selectors.gradesTable)
            .toArray().filter(t => t.innerHTML.indexOf(selectors.testGrade) === -1)[0];
        if (gradesTable) {
            gradesTable.id = 'grades';
        } else {
            throw new Error('[data-scraper] table not found!');
        }
    },
};

module.exports = dataScraper;
