/**
 * LibPLUS
 * Author: Dawid Stankiewicz
 * theszczypiorek[ at ]gmail.com
 * github.com/DawidStankiewicz
 *
 */

window.onload = function onload() {
    init();
};

/**
 * GRADE OBJECT
 */
function Grade() {
    this.id;
    this.type;
    this.rawData;
    this.rawVal;
    this.val;
    this.subject;
    this.category;
    this.date;
    this.weight;
    this.teacher;
    this.addedBy;
    this.semester;
}

/**
 * SUBJECT OBJECT
 */
function Subject() {
    this.id;
    this.name;
    this.avg;
    this.firstSemesterAvg;
    this.secondSemesterAvg;
}

/**
 * USER OBJECT
 *
 */
function User() {
    this.name;
    this.grades;
    this.subjects;
}
let user = new User();

/**
 *
 * @returns {User}
 */
function getUserWithData() {
    let user = new User();
    user.name = findUserName();
    user.grades = findAllGrades();
    user.subjects = getAllSubjects(user.grades);
    return user;
}

function findUserName() {
    return $('b:contains("Uczeń:")').parent().text().replace('Uczeń: ', '').replace('Klasa:', '');
}


/**
 * init FUNCTION
 */
function init() {
    if (isAllGradeMode()) {
        console.log('Jesteś w trybie "wszystkie oceny"');
    } else {
        console.log('Jesteś w trybie "oceny od ostatniego logowania". Przejdź do trybu "wszystkie oceny" aby LibPLUS działał prawidłowo!');
    }

    user = getUserWithData();
    createContainers();
    calculateAndDisplayAvg();

    setNumberOfGradesOnPage(countGrades());

    createButtons();
}

/**
 * CONTAINERS FOR DATA ON PAGE
 */
function createContainers() {
    createLibPLUSContainer();
    $('#' + LIBPLUS_ID).append(STUDENT_AVG_CONTAINER);
    $('#' + LIBPLUS_ID).append(STUDENT_AVG_END_FIRST_CONTAINER);

    $('#' + LIBPLUS_ID).append(STUDENT_AVG_PROPOSED_SECOND_CONTAINER);

    $('#' + LIBPLUS_ID).append(STUDENT_AVG_END_SECOND_CONTAINER);
    $('#' + LIBPLUS_ID).append(STUDENT_GRADE_COUNTER_CONTAINER);

    createContainersOfSubjects();
    createFormForUserAvgOfDateRage();
    createContainerForUserAvgOfDateRage();
}
function createLibPLUSContainer() {
    $(".container-icon").after('<div id=' + LIBPLUS_ID + ' class="container"></div>')
}
function createContainersOfSubjects() {
    user.subjects.forEach(function (subject) {
        /**
         * https://api.jquery.com/nth-child-selector/
         */

        let firstSemesterAvgColumn = 4;
        let secondSemesterAvgColumn = 8;
        let endAvgColumn = 10;

        // First semester avg container
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + firstSemesterAvgColumn + ")").after().html(" ");
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + firstSemesterAvgColumn + ")").after().append('<span title="Średnia wyświetlona dzięki rozszerzeniu LibPLUS." id="' + FIRST_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id + '"></span>');
        // Second semester avg container
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + secondSemesterAvgColumn + ")").after().html(" ");
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + secondSemesterAvgColumn + ")").after().append('<span title="Średnia wyświetlona dzięki rozszerzeniu LibPLUS." id="' + SECOND_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id + '"></span>');
        // End avg of subject container
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + endAvgColumn + ")").after().html(" ");
        $("#przedmioty_" + subject.id).prev().children("td:nth-child(" + endAvgColumn + ")").after().append('<span title="Średnia wyświetlona dzięki rozszerzeniu LibPLUS." id="' + AVG_OF_SUBJECT_CONTAINER_ID + subject.id + '"></span>');
    });
}
function createContainerForUserAvgOfDateRage() {
    $('#' + LIBPLUS_ID).append(STUDENT_AVG_DATE_RAGE_CONTAINER);
}

/**
 * DISPLAY DATA ON PAGE
 */

function setAvgValueOfUserOnPage(avg) {
    $('#' + STUDENT_AVG_CONTAINER_ID).text(avg);
}

function setNumberOfGradesOnPage(num) {
    $('#' + STUDENT_GRADE_COUNTER_CONTAINER_ID).text(num);
}

function setAvgValueOfSubjectOnPage(subjects) {
    subjects.forEach(function (subject) {
        $('#' + AVG_OF_SUBJECT_CONTAINER_ID + subject.id).text(roundDecimalPlaces(subject.avg));
    });
}
function setFirstSemesterAvgValueOfSubjectOnPage(subjects) {
    subjects.forEach(function (subject) {
        if (isNaN(subject.firstSemesterAvg)) {
            $('#' + SECOND_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id).text('-');
        } else {
            $('#' + FIRST_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id).text(roundDecimalPlaces(subject.firstSemesterAvg));
        }
    });
}
function setSecondSemesterAvgValueOfSubjectOnPage(subjects) {
    subjects.forEach(function (subject) {
        if (isNaN(subject.secondSemesterAvg)) {
            $('#' + SECOND_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id).text('-');
        } else {
            $('#' + SECOND_SEMESTER_AVG_OF_SUBJECT_CONTAINER_ID + subject.id).text(roundDecimalPlaces(subject.secondSemesterAvg));
        }
    });
}

function setAvgValueOfEndFirstPeriodOnPage(avg) {
    $('#' + STUDENT_AVG_END_FIRST_CONTAINER_ID).text(avg);
}

function setAvgValueOfEndSecondPeriodOnPage(avg) {
    $('#' + STUDENT_AVG_END_SECOND_CONTAINER_ID).text(avg);
}

function setAvgValueOfProposedSecondPeriodOnPage(avg) {
    $('#' + STUDENT_AVG_PROPOSED_SECOND_CONTAINER_ID).text(avg);
}


function setAvgValueOfDateRangeOnPage(avg) {
    $('#' + STUDENT_AVG_DATE_RAGE_CONTAINER_ID).text(roundDecimalPlaces(avg));
}

function displayGradesAndAvg(grades) {
    hideAllGrades();
    grades.forEach(function (grade) {
        showGradeOnPage(grade.id);
        if (grade.weight != 0) {
            showSubjectAvgContainer(getGradeSubject(grade.id));
        }
    });
}

function hideAllGrades() {
    user.grades.forEach(function (grade) {
        hideGradeOnPage(grade.id);
        hideSubjectAvgContainer(getGradeSubject(grade.id));
    })
}

function hideGradeOnPage(i) {
    $(GRADE_ID + i).hide();
}

function showGradeOnPage(i) {
    $(GRADE_ID + i).show();
}

function hideSubjectAvgContainer(subject) {
    $("#avgSubject_" + subject.id).hide();
}

function showSubjectAvgContainer(subject) {
    $("#avgSubject_" + subject.id).show();
}

/**
 * AVG FUNCTIONS
 */

function calculateAndDisplayAvg() {
    setAvgValueOfUserOnPage(roundDecimalPlaces(getCalculatedAvg(user.grades)));
    setFirstSemesterAvgValueOfSubjectOnPage(user.subjects);
    setSecondSemesterAvgValueOfSubjectOnPage(user.subjects);
    setAvgValueOfSubjectOnPage(user.subjects);

    setAvgValueOfEndFirstPeriodOnPage(roundDecimalPlaces(getCalculatedAvg(getGradesOfType(GRADE_END_FIRST, user.grades))));

    setAvgValueOfProposedSecondPeriodOnPage(roundDecimalPlaces(getCalculatedAvg(getGradesOfType(GRADE_PROPOSED_SECOND, user.grades))));
    setAvgValueOfEndSecondPeriodOnPage(roundDecimalPlaces(getCalculatedAvg(getGradesOfType(GRADE_END_SECOND, user.grades))));
}
function getCalculatedAvg(grades) {
    let avg = 0.0,
        counter = 0.0,
        valSum = 0.0,
        weightSum = 0.0;

    grades.forEach(function (grade) {
        let val = Number(grade.val), weight = Number(grade.weight);

        if (weight != 0) {
            valSum = valSum + (val * weight);
            weightSum = weightSum + weight;
            counter++;

            if (DEBUG_AVG_CALCULATE) {
                console.log('id: ' + grade.id);
                console.log('type : ' + grade.type);
                console.log('grade val: ' + val);
                console.log('subject: ' + grade.subject);
                console.log('semester:  ' + grade.semester);
                console.log('weight: ' + weight);
                console.log('counter:  ' + counter);
                console.log('avg: ' + valSum / weightSum);
                console.log('\n\n\n');
            }
        }
    });
    if (weightSum !== 0) {
        avg = valSum / weightSum;
    }
    return avg;
}

function getAvgOfSubject(subjectName, grades) {
    let gradesOfSubject = [],
        counter = 0;
    grades.forEach(function (grade) {
        if (subjectName.localeCompare(grade.subject) === 0) {
            gradesOfSubject[counter] = grade;
            counter++;
        }
    });
    return getCalculatedAvg(gradesOfSubject);
}

function getAvgOfSubjectOfSemester(subjectName, semester, grades) {
    let gradesOfSubject = [],
        counter = 0;
    grades.forEach(function (grade) {
        if (subjectName.localeCompare(grade.subject) === 0 && grade.semester === semester) {

            gradesOfSubject[counter] = grade;
            counter++;
        }
    });
    return getCalculatedAvg(gradesOfSubject);
}

/**
 * GRADES END OF FIRST PERIOD
 *
 * @param grades
 * @returns {Array}
 */

function getGradesOfType(type, grades) {
    let gradesOfType = [];
    let i = 0;

    grades.forEach(function (grade) {
        if (type === grade.type) {
            let gradeOfType = jQuery.extend({}, grade); // copy object
            gradeOfType.weight = 1;
            gradesOfType[i] = gradeOfType;
            i++;
        }
    });
    return gradesOfType;
}

/**
 * GRADES
 */


/**
 * FIND ALL GRADES FUNCTION
 * @returns {Array}
 */
function findAllGrades() {
    let gradeId = 1;
    let grades = [];
    let semester = 1;
    let prevSubject;

    while (isGradeExist(gradeId)) {
        let grade = new Grade();


        grade.id = gradeId;
        grade.type = getGradeType(grade.id);
        grade.rawData = getGradeRawData(gradeId);
        grade.rawVal = getGradeRawValue(gradeId);
        grade.val = getGradeValueFromRawValue(grade.rawVal);
        grade.subject = getGradeSubject(grade.id);
        grade.category = getGradeCategoryFromRawData(grade.rawData);
        grade.date = getGradeDateFromRawData(grade.rawData);
        grade.weight = getGradeWeightFromRawData(grade.rawData);
        grade.teacher = getGradeTeacherFromRawData(grade.rawData);
        grade.addedBy = getGradeAddedByFromRawData(grade.rawData);


        if (prevSubject === undefined || prevSubject !== grade.subject) {
            prevSubject = grade.subject;
            semester = 1;
        }

        grade.semester = semester;

        if (grade.category === CATEGORY_END_FISRT) {
            semester = 2;
        }

        grades[gradeId - 1] = grade;

        if (DEBUG_GRADES) {
            console.debug("id: " + grades[gradeId - 1].id);
            console.debug("type: " + grades[gradeId - 1].type);
            console.debug("raw data: " + grades[gradeId - 1].rawData);
            console.debug("raw val: " + grades[gradeId - 1].rawVal);
            console.debug("val: " + grades[gradeId - 1].val);
            console.debug("subject: " + grades[gradeId - 1].subject);
            console.debug("category: " + grades[gradeId - 1].category);
            console.debug("date: " + grades[gradeId - 1].date);
            console.debug("weight: " + grades[gradeId - 1].weight);
            console.debug("teacher: " + grades[gradeId - 1].teacher);
            console.debug("added by: " + grades[gradeId - 1].addedBy);
            console.debug("semester: " + grades[gradeId - 1].semester);
            console.debug('\n\n');
        }

        gradeId++;
    }
    return grades;
}

/**
 * GRADE COUNTER
 *
 * @returns {number}
 */
function countGrades() {
    let counter = 0, gradeId = 1;
    let isNext = true;
    do {
        if (isGradeExist(gradeId)) {
            counter++;
            gradeId++;
        } else isNext = false;
    } while (isNext);
    return counter;
}

function isGradeExist(id) {
    return ($(GRADE_ID + id).html() != null);
}


/**
 * GRADE DATA
 */
function getGradeRawData(id) {
    return $(GRADE_ID + id).children('a').attr(TITLE_ATTRIBUTE).replace(/<br>/g, ";").replace(/: /g, ":").replace(/<br\/>/g, ";");
}

function getGradeRawValue(id) {
    return $(GRADE_ID + id).children('a').html();
}

function getGradeType(id) {
    let gradeType = GRADE_NORMAL;
    if (isGradeProposedFromFirstPeriod(id)) {
        gradeType = GRADE_PROPOSED_FIRST;
    }
    else if (isGradeProposedFromSecondPeriod(id)) {
        gradeType = GRADE_PROPOSED_SECOND;
    }
    else if (isGradeEndFirst(id)) {
        gradeType = GRADE_END_FIRST;
    }
    else if (isGradeEndSecond(id)) {
        gradeType = GRADE_END_SECOND;
    }
    else if (isPlus(getGradeRawValue(id))) {
        gradeType = GRADE_PLUS;
    }
    else if (isMinus(getGradeRawValue(id))) {
        gradeType = GRADE_MINUS;
    }
    else if (isGradeUnprepared(id)) {
        gradeType = GRADE_UNPREPARED;
    }
    return gradeType;
}

function getGradeValueFromRawValue(rawVal) {
    let gradeValue = 0;
    if (rawVal !== null && rawVal != undefined && !isPlusOrMinus(rawVal) && isNumberWithPlusOrMinus(rawVal)) {
        gradeValue = getConvertedNumberFromRawGradeValue(rawVal);
    }
    return gradeValue;
}

function getGradeSubject(id) {
    let subject = $(GRADE_ID + id).parent().parent().children("td:eq(1)").html();
	if (subject === undefined) {
		subject = $(GRADE_ID + id).parent().parent().parent().children("td:eq(1)").html();
	}
    return subject;
}

function getGradeCategoryFromRawData(rawData) {
    return rawData.substr(rawData.indexOf("Kategoria:") + 10, 100).split(";")[0];
}

function getGradeDateFromRawData(rawData) {
    return rawData.substr(rawData.indexOf("Data:") + 5, 10).split(";")[0];
}

function getGradeTeacherFromRawData(rawData) {
    return rawData.substr(rawData.indexOf("Nauczyciel:") + 11, 50).split(";")[0];
}

function getGradeAddedByFromRawData(rawData) {
    return rawData.substr(rawData.indexOf("Dodał:") + 6, 50).split(";")[0];
}

function getConvertedNumberFromRawGradeValue(grade) {
    if (hasPlusOrMinus(grade)) {
        // if grade has '+' remove it and add 0.5
        if (grade.search(/\+/g) != -1) {
            grade = Number(grade.replace(/\+/g, ''));
            grade += 0.5;
        }
        // if grade has '-' remove it and subtract 0.25
        else if (grade.search("-") != -1) {
            grade = Number(grade.replace('-', ''));
            grade -= 0.25;
        }
    }
    return grade;
}

function getGradeWeightFromRawData(rawData) {
    if (isWeightExist(rawData)) {
        return getGradeWeightSubstring(rawData);
    }
    return 0;
}

function getGradeWeightSubstring(rawData) {
    return rawData.substr(rawData.indexOf("Waga:") + 5, 4).split(";")[0];
}

function isWeightExist(rawData) {
    return (rawData.indexOf("Waga:") !== -1);
}

function isNumberWithPlusOrMinus(grade) {
    if (hasPlusOrMinus(grade)) {
        grade = grade.replace(/\+/g, '');
        grade = grade.replace('-', '');
    }
    return !isNaN(grade);
}

function isPlusOrMinus(rawVal) {
    return (hasPlusOrMinus(rawVal) && rawVal.length == 1);
}

function isPlus(grade) {
    return (grade.search(/\+/g) != -1 && grade.length == 1);
}

function isMinus(grade) {
    return (grade.search("-") != -1 && grade.length == 1);
}

function hasPlusOrMinus(grade) {
    return (grade.search(/\+/g) != -1 || grade.search("-") != -1);
}

function isGradeProposedFromFirstPeriod(id) {
    return ($(GRADE_ID + id).children('a').attr(TITLE_ATTRIBUTE).indexOf(CATEGORY_PROPOSED_FISRT) !== -1);
}

function isGradeProposedFromSecondPeriod(id) {
    return ($(GRADE_ID + id).children('a').attr(TITLE_ATTRIBUTE).indexOf(CATEGORY_PROPOSED_SECOND) !== -1);
}

function isGradeEndFirst(id) {
    return ($(GRADE_ID + id).children('a').attr(TITLE_ATTRIBUTE).indexOf(CATEGORY_END_FISRT) !== -1);
}

function isGradeEndSecond(id) {
    return ($(GRADE_ID + id).children('a').attr(TITLE_ATTRIBUTE).indexOf(CATEGORY_END_SECOND) !== -1);
}

function isGradeUnprepared(id) {
    return ($(GRADE_ID + id).children('a').html().indexOf('np') !== -1);
}


/**
 * SUBJECTS
 */

/**
 *
 * @param grades
 * @returns {Array}
 */
function getAllSubjects(grades) {
    let subjects = [];
    let counter = 0;

    grades.forEach(function (grade) {
        if (counter == 0 || subjects[counter - 1].name.localeCompare(grade.subject) !== 0) {
            let subject = new Subject();
            subject.id = getIdOfSubjectOfGrade(grade.id);
            subject.name = grade.subject;
            subject.avg = getAvgOfSubject(subject.name, grades);
            subject.firstSemesterAvg = getAvgOfSubjectOfSemester(subject.name, 1, grades);
            subject.secondSemesterAvg = getAvgOfSubjectOfSemester(subject.name, 2, grades);

            subjects[counter] = subject;
            counter++;
        }
    });
    return subjects;
}

/**
 *
 * @param id
 * @returns {id}
 */
function getIdOfSubjectOfGrade(id) {
	let idSubject = $(GRADE_ID + id).parent().parent().next().attr('id');
	if (idSubject === undefined) {
		idSubject = $(GRADE_ID + id).parent().parent().parent().next().attr('id');
	}
    return idSubject.split("_")[1];
}


/**
 * DATA FROM SELECTED RANGE
 */

/**
 *
 * @param date
 * @param dateRangeStart
 * @param dateRangeEnd
 * @returns {Array}
 */

function getGradesByDateRange(dateStart, dateEnd) {
    let gradesByDateRange = [];
    let i = 0;
    user.grades.forEach(function (grade) {
        if (isDateInSelectedRange(grade.date, dateStart, dateEnd)) {
            gradesByDateRange[i] = grade;
            i++;
        }
    });
    return gradesByDateRange;
}

function showDataFromSelectedRange() {
    let dateStart = $("#dateRageStart").val();
    let dateEnd = $("#dateRageEnd").val();

    let gradesFromDateRange = getGradesByDateRange(dateStart, dateEnd);
    let avg = getCalculatedAvg(gradesFromDateRange);
    let subjects = getAllSubjects(gradesFromDateRange);

    displayGradesAndAvg(gradesFromDateRange);
    setAvgValueOfDateRangeOnPage(avg);
    setAvgValueOfSubjectOnPage(subjects);
}

function createFormForUserAvgOfDateRage() {
    $('#' + LIBPLUS_ID).append(STUDENT_AVG_DATE_RAGE_FROM);
    let today = getDate(), schoolYearStartDate = getSchoolYearStartDate();
    $("#dateRageStart").val(schoolYearStartDate);
    $("#dateRageEnd").val(today);

    $("#showDataFromRange").click(function () {
        showDataFromSelectedRange();
    });
}

function isDateInSelectedRange(date, dateRangeStart, dateRangeEnd) {
    return ((date.localeCompare(dateRangeStart) === 0 || date.localeCompare(dateRangeStart) === 1) && (date.localeCompare(dateRangeEnd) === -1 || date.localeCompare(dateRangeEnd) === 0));
}


/**
 * BUTTONS
 */

function createButtons() {
    addUpdateButtonOnPage();
    addExportToExcelButtonOnPage();
}

/**
 * UPDATE BUTTON
 */
function addUpdateButtonOnPage() {
    $(".inside")
        .after('<div id="updateButton"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Aktualizuj</span><span class="fold-end"></span></a></span></div>');
    $("#updateButton").click(function () {
        updateAll();
    });
}

function updateAll() {
    user = getUserWithData();
    calculateAndDisplayAvg();
    console.log("updated");
}

/**
 * Export user's data thanks to ExcelPlus
 *
 * http://aymkdn.github.io/ExcelPlus/
 */
function addExportToExcelButtonOnPage() {
    $(".inside")
        .after('<div id="exportButton" title="Eksportuj oceny do Excela dzięki rozszerzeniu LibPLUS!"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Eksportuj</span><span class="fold-end"></span></a></span></div>');
    $("#exportButton").click(function () {
        exportDataToExcel();
    });
}

function exportDataToExcel() {
    let excelPlus = new ExcelPlus();
    excelPlus
        .createFile("Oceny")
        .write({"content": [['ID', 'PRZEDMIOT', 'NAUCZYCIEL', 'DATA', 'KATEGORIA', 'TYP', 'DODANE PRZEZ', 'RAW', 'OCENA', 'WAGA']]});
    let line = 2;
    user.grades.forEach(function (grade) {
        let weight = Number(grade.weight);
        excelPlus
            .write({'cell': 'A' + line, 'content': grade.id})
            .write({'cell': 'B' + line, 'content': grade.subject})
            .write({'cell': 'C' + line, 'content': grade.teacher})
            .write({'cell': 'D' + line, 'content': grade.date})
            .write({'cell': 'E' + line, 'content': grade.category})
            .write({'cell': 'F' + line, 'content': grade.type})
            .write({'cell': 'G' + line, 'content': grade.addedBy})
            .write({'cell': 'H' + line, 'content': grade.rawVal})
            .write({"cell": "I" + line, "content": grade.val === 0 ? 0 + "" : Number(grade.val)})
            .write({"cell": "J" + line, "content": "" + Number(weight)});
        line++;
    });
    let fileName = user.name + 'LibPLUS-' + new Date().getTime() + '.xlsx';
    fileName = fileName.replace(/\u00a0| /g, "_");
    excelPlus.saveAs(fileName);
    console.log('Generated file: ' + fileName);
}


/**
 * OTHER FUNCTIONS
 */

/**
 *
 * @param number
 * @returns {*}
 */
function roundDecimalPlaces(number) {
    return number.toFixed(DISPLAY_PRECISION_FLOAT_NUMBER);
}

function isAllGradeMode() {
    return ($('#zmiany_logowanie_wszystkie').length === 0);
}

function getDate(date) {
    if (date === undefined) date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return year + '-' + month + '-' + day;
}

function getSchoolYearStartDate() {
    let today = new Date();
    if ((today.getMonth() + 1) < 9) {
        return getDate(new Date((today.getFullYear() - 1) + '-09-01'));
    }
    return getDate(new Date(today.getFullYear() + '-09-01'));
}
