const $ = require("jquery");
const {
    gradeProperties,
    gradesRawValue,
    termGradesCategories,
    selectors,
    gradeId
} = require('./patterns.js');

const gradeType = {
    PROPOSED_FIRST: 'PROPOSED_FIRST',
    END_FISRT: 'END_FISRT',
    PROPOSED_SECOND: 'PROPOSED_SECOND',
    END_SECOND: 'END_SECOND',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    NP: 'NP',
    NORMAL: 'NORMAL'
};

const gradeParser = {
    parseAll: function (grades) {
        let parsed = [];
        grades.forEach(grade => {
            parsed.push(this.parse(grade));
        })
        return parsed;
    },
    parse: function (grade) {
        const {id, html} = grade;
        for (let property in gradeProperties) {
            grade[property] = this.parseValueFromRaw(html, gradeProperties[property]);
        }
        const term = this.parseGradeTerm(id);
        const subject = this.parseGradeSubject(id);
        const type = this.getGradeType(grade.category, grade.rawValue);
        const val = this.parseGradeValFromRawVal(grade.rawValue, type);

        const parsedGrade = {
            term,
            subject,
            type,
            val,
            ...grade
        }
        return parsedGrade;
    },
    parseValueFromRaw: function (html, regex) {
        let matcher = html.match(regex);

        return matcher ? matcher[1] : undefined;
    },
    parseGradeValFromRawVal: function (rawValue, type) {
        let val = 0;
        if (type === gradeType.MINUS ||
            type === gradeType.PLUS ||
            type === gradeType.NP) {
            return 0;
        }
        const numberWithPlusMatcher = /(\d)(?:\+)/;
        const numberWithMinusMatcher = /(\d)(?:-)/;

        let numberWithPlus = rawValue.match(numberWithPlusMatcher);
        let numberWithMinus = rawValue.match(numberWithMinusMatcher);
        if (numberWithPlus) {
            val = Number(numberWithPlus[1]) + 0.5;
        } else if (numberWithMinus) {
            val = Number(numberWithMinus[1]) - 0.25;
        } else {
            val = Number(rawValue);
        }
        return val;
    },
    getGradeType: function (category, rawValue) {
        const {MINUS, PLUS, NP} = gradesRawValue;
        // check if grade category is one of the end-term grade categories
        for (let cat in termGradesCategories) {
            if (category === termGradesCategories[cat]) {
                return gradeType[cat];
            }
        }
        if (rawValue.match(MINUS)) {
            return gradeType.MINUS;
        }
        if (rawValue.match(PLUS)) {
            return gradeType.PLUS;
        }
        if (rawValue.match(NP)) {
            return gradeType.NP;
        }
        return gradeType.NORMAL;
    },
    parseGradeTerm: function (id) {
        const cellIndex = $(selectors.grade(gradeId(id))).parents().closest('td')[0].cellIndex;
        switch (cellIndex) {
            case 2:
            case 4:
            case 5:
                return 1;
            case 6:
            case 8:
            case 10:
                return 2;
        }
        return 0;
    },
    parseGradeSubject: function (id) {
        const parentId = $(selectors.grade(gradeId(id))).parents().closest('tr')[0].id;
        const subjectId = parentId.split('-')[1];
        return {id: subjectId};
    }
}

module.exports = gradeParser;
