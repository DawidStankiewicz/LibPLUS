module.exports = {
    gradeProperties: {
        rawValue: /(?:<a.+>)(.*?)(?:<\/a>)/,
        category: /(?:Kategoria: )(.*?)(?:<br>)/,
        date: /(?:Data: )(.*?)(?: \(.+\)<br>)/,
        teacher: /(?:Nauczyciel: )(.*?)(?:<br>)/,
        weight: /(?:Waga: )(.*?)(?:<br>)/,
        addedBy: /(?:Dodał: )(.*?)(?:<br\/?>)/,
        comment: /(?:Komentarz: )(.*?)(?:")/
    },
    gradesRawValue: {
        MINUS: /^-$/,
        PLUS: /^\+$/,
        NP: /^np$/,
    },
    termGradesCategories: {
        PROPOSED_FIRST: 'przewidywana śródroczna',
        END_FISRT: 'śródroczna',
        PROPOSED_SECOND: 'przewidywana roczna',
        END_SECOND: 'roczna'
    },
    selectors: {
        gradesTable: 'table:has(span[class^="grade-box"])',
        rowsWithGrades: '#grades tbody tr:has(span[class="grade-box"])',
        subjectNameRow: 'td:nth-child(2)',
        gradeBox: '.grade-box',
        testGrade: 'ocenaTest',
        grade: (id) => {
            return '#' + id;
        },
    },
    gradeId: (id) => {
        return 'grade-' + id;
    },
    gradeType: {
        PROPOSED_FIRST: 'PROPOSED_FIRST',
        END_FISRT: 'END_FISRT',
        PROPOSED_SECOND: 'PROPOSED_SECOND',
        END_SECOND: 'END_SECOND',
        PLUS: 'PLUS',
        MINUS: 'MINUS',
        NP: 'NP',
        NORMAL: 'NORMAL'
    }
}
