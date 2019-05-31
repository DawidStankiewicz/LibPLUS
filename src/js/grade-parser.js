const {
    gradeProperties,
    gradesRawValue,
    termGradesCategories,
    selectors,
    gradeId,
    gradeType
} = require('./patterns.js');

const gradeParser = {
    init: function (sourcePage) {
        this.sourcePage = sourcePage;
    },
    parseAll: function (grades) {
        let parsed = [];
        grades.forEach(grade => {
            parsed.push(this.parse(grade));
        });
        return parsed;
    },
    parse: function (grade) {
        const {id, html} = grade;
        for (let property in gradeProperties) {
            grade[property] = this.parseValueFromRawHTML(html, gradeProperties[property]);
        }
        const term = this.parseGradeTerm(id);
        const subject = this.parseGradeSubject(id);
        const type = this.getGradeType(grade.category, grade.rawValue);
        const val = this.parseGradeValFromRawVal(grade.rawValue, type);
        return {
            term,
            subject,
            type,
            val,
            ...grade
        };
    },
    parseValueFromRawHTML: function (html, regex) {
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
        const grade = $(this.sourcePage).find(selectors.grade(gradeId(id)));
        if (!grade.length) {
            throw new Error('[grade-parser] grade not found!');
        }
        const cellIndex = grade.parents().closest('td')[0].cellIndex;
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
        const grade = $(this.sourcePage).find(selectors.grade(gradeId(id)));
        if (!grade.length) {
            throw new Error('[grade-parser] grade not found!');
        }
        const parentId = grade.parents().closest('tr')[0].id;
        const subjectId = parentId.split('-')[1];
        return {id: subjectId};
    }
};

module.exports = gradeParser;
