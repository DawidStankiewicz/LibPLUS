/**
 * LibPLUS
 * Version: 2.0 - 05.01.2017
 * Author: Dawid Stankiewicz
 * theszczypiorek[ at ]gmail.com
 * github.com/Szczypioreg
 *
 */


/**
 Grade object
 */
function Grade(id, type, rawData, rawVal, val, subject, category, date, weight, teacher, addedBy) {
    this.id = id;
    this.type = type;
    this.rawData = rawData;
    this.rawVal = rawVal;
    this.val = val;
    this.subject = subject;
    this.category = category;
    this.date = date;
    this.weight = weight;
    this.teacher = teacher;
    this.addedBy = addedBy;
}
/**
 Subject object
 */
function Subject(id, avg, numberOfGrades) {
    this.id = id;
    this.avg = avg;
    this.numberOfGrades = numberOfGrades;
}

/**
 Grade types:
 */
const
    GRADE_NORMAL = 'NORMAL',
    GRADE_MINUS = 'MINUS',
    GRADE_PLUS = 'PLUS',
    GRADE_PROPOSED_FIRST = 'PROPOSED_FIRST',
    GRADE_PROPOSED_SECOND = 'PROPOSED_SECOND',
    GRADE_END_FIRST = 'END_FISRT',
    GRADE_END_SECOND = 'END_SECOND',
    GRADE_UNPREPARED = "UNPREPARED",

    TITLE_ATTRIBUTE = 'title',
    GRADE_ID = "#Ocena",

    /**
     * Constant categories of grades
     */
    CATEGORY_PROPOSED_FISRT = 'przewidywana śródroczna',
    CATEGORY_END_FISRT = 'śródroczna',
    CATEGORY_PROPOSED_SECOND = 'przewidywana roczna',
    CATEGORY_END_SECOND = 'przewidywana roczna',

    STUDENT_AVG_CONTAINER_ID = 'studentAvgContainer',
    STUDENT_AVG_CONTAINER = '<td><p><b>Średnia: </b><span id="' + STUDENT_AVG_CONTAINER_ID + '">!</span>',

    STUDENT_GRADE_COUNTER_CONTAINER_ID = 'allGradeCounter',
    STUDENT_GRADE_COUNTER_CONTAINER = '<b>Wszystkich ocen: </b><span id=' + STUDENT_GRADE_COUNTER_CONTAINER_ID + '>!</span></p></td>',
    /**
     * eg. 3.02564865545 to 3.03
     */
    DISPLAY_PRECISION_FLOAT_NUMBER = 2,

    DEBUG_GRADES = false,
    DEBUG_AVG_CALCULATE = false;


/**
 Global variables

 */
numberOfAllGrades = countGrades();


window.onload = function onload() {
    main();
}


function main() {
    if (isAllGradeMode()) {
        createContainersOnPage();
        let grades = findAllGrades();
        let subjects = getAllSubjects(grades);


        setAvgValueOfUserOnPage(roundDecimalPlaces(calculateAvg(grades)));

        setNumberOfGradesOnPage(numberOfAllGrades);

        addUpdateButtonToPage();

        addExportToExcelButtonToPage();
    }
}





function calculateAvg(gradeList) {
    let grades = gradeList,
        avg = 0.0,
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
                console.log('weight: ' + weight);
                console.log('counter:  ' + counter);
                console.log('avg: ' + valSum / weightSum);
                console.log('\n\n\n');
            }
        }
    });
    avg = valSum / weightSum;
    return avg;
}


function findAllGrades() {
    let gradeId = 1,
        grades = [];
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
            console.debug('\n\n');
        }
        gradeId++;
    }
    return grades;
}


function calculateAndDisplayTheAverage() {
    /**
     weightedAvg = sumOfProductsGradesAndWeights / sumOfWeights =
     = (d1*w1 + d2*w2 + ... + di*wi) / (w1 + w2 + ... + wi)
     */
    let sumOfProductsGradesAndWeights = 0, sumOfWeights = 0;
	
	let a = 0, b = 0;
	
    let weightedAvg = 0, gradeId = 1, subjectId = 0, numberOfSubjectsWithAvg = 0, counter = 0;
    while (isGradeExist(gradeId)) {

		
        dataOfGrade = getGradeRawData(gradeId);
        grade = getGradeRawValue(gradeId);

        if (isNumberWithPlusOrMinus(grade) && !isPlusOrMinus(grade)) {
            if (hasPlusOrMinus(grade)) {
                grade = getConvertedNumberFromRawGradeValue(grade); // eg from 4+ convert to 4.5 or 4- convet to 3.75
            }
            gradeWeight = getGradeWeightFromRawData(dataOfGrade); // get grade weight
            sumOfProductsGradesAndWeights += (grade * gradeWeight); // now when we have grade and weight we can count
            sumOfWeights += Number(gradeWeight);
            counter++;
			
			a += grade * gradeWeight;
			b += gradeWeight;
			
            console.log('id: ' + gradeId);
            console.log('grade rawval: ' + getGradeRawValue(gradeId));
            console.log('grade val: ' + grade);
            console.log('weight: ' + gradeWeight);
            console.log('counter:  ' + counter);
			if (b!= 0)
            console.log('avg: ' + a/b);
            console.log('\n\n\n');
        }
        gradeId++;
        if (!isNextGradeOfSubject(gradeId - 1)) {
            subjectId++;
            subject = subjects[subjectId] = new Subject(subjectId);
            if (!isNaN(sumOfProductsGradesAndWeights / sumOfWeights)) {
                numberOfSubjectsWithAvg++;
                subject.avg = sumOfProductsGradesAndWeights / sumOfWeights;
                setAvgOfSubjectOnPage(subjectId, subject.avg.toFixed(DISPLAY_PRECISION_FLOAT_NUMBER + 2));
                sumOfProductsGradesAndWeights = 0;
                sumOfWeights = 0;
                weightedAvg += subject.avg;
            } else {
                setAvgOfSubjectOnPage(subjectId, "");
            }
        }
    }
    weightedAvg /= numberOfSubjectsWithAvg;
    console.log("Your avg: " + weightedAvg);
    gradesCounter = gradeId - 1;
    setAvgValueOfUserOnPage(weightedAvg.toFixed(DISPLAY_PRECISION_FLOAT_NUMBER));
}


function createContainersOnPage() {
    /**
     * Add container for student avg and number of all grades.
     */
    $(".container-icon > table > tbody > tr > td").last()
        .after('<td>' + STUDENT_AVG_CONTAINER + '<br />' + STUDENT_GRADE_COUNTER_CONTAINER + '</td>');
    /**
     * Add containers for the avg of subjects (#avgSubject[id])
     */
    let gradeId = 0, subjectId = 0;
    while (isGradeExist(gradeId)) {
        gradeId++;
        if (!isNextGradeOfSubject(gradeId)) {
            subjectId++;
            $(GRADE_ID + (gradeId)).parent().next().append('<span id="avgSubject' + subjectId + '"></span>');
        }
    }
}
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

function roundDecimalPlaces(number) {
    return number.toFixed(DISPLAY_PRECISION_FLOAT_NUMBER);
}


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
    let subject = null;
    if (isGradeProposedFromFirstPeriod(id)) {
        subject = $(GRADE_ID + id).parent().prevAll().eq(2).html();
    } else if (isGradeEndFirst(id)) {
        subject = $(GRADE_ID + id).parent().prevAll().eq(3).html();
    } else if (isGradeProposedFromSecondPeriod(id)) {
        subject = $(GRADE_ID + id).parent().prevAll().eq(2).html();
    } else if (isGradeEndSecond(id)) {
        subject = $(GRADE_ID + id).parent().prevAll().eq(3).html();
    }
    else {
        subject = $(GRADE_ID + id).parent().prev().html();
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
function getAllSubjects(grades) {
    var subjects = new Array();
    let counter = 0;
    grades.forEach(function (grade) {
        if (grade.subject.localeCompare(subjects[counter - 1]) !== 0) {
            subjects[counter] = grade.subject;
            counter++;
        }
    });
    return subjects;
}





function isAllGradeMode() {
    return ($('#zmiany_logowanie_wszystkie').length == 0);
}
function isGradeExist(id) {
    return ($(GRADE_ID + id).html() != null);
}

function isWeightExist(rawData) {
    return (rawData.indexOf("Waga:") !== -1);
}
function isNextGradeOfSubject(gradeIndex) {
    return (typeof $(GRADE_ID + gradeIndex).next().html() !== "undefined");
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





function setAvgOfSubjectOnPage(subjectId, avg) {
    $("#avgSubject" + subjectId).text(avg);
}

function setAvgValueOfUserOnPage(avg) {
    $('#' + STUDENT_AVG_CONTAINER_ID).text(avg);
}

function setNumberOfGradesOnPage(num) {
    $('#' + STUDENT_GRADE_COUNTER_CONTAINER_ID).text(num);
}





function updateAll() {
    grades = [], subjects = [];
    numberOfAllGrades = countGrades();
    calculateAndDisplayTheAverage();
    setNumberOfGradesOnPage(numberOfAllGrades);
    console.log("updated");
}


function addUpdateButtonToPage() {
    $(".inside")
        .after('<div id="updateButton"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Aktualizuj</span><span class="fold-end"></span></a></span></div>');
    $("#updateButton").click(function () {
        updateAll();
    });
}

/**
 * Export user's data thanks to ExcelPlus 
 * 
 * http://aymkdn.github.io/ExcelPlus/
 */

function exportDataToExcel() {
    let excelPlus = new ExcelPlus();
    excelPlus
        .createFile("Oceny")
        .write({"content":[ ['ID','PRZEDMIOT','NAUCZYCIEL','DATA','KATEGORIA','TYP','DODANE PRZEZ','RAW','OCENA','WAGA'] ]});
	
	let line = 2;
	findAllGrades().forEach(function (grade) {
		let weight = Number(grade.weight);
		
		excelPlus
			.write({ 'cell' : 'A'+line, 'content' : grade.id })
			.write({ 'cell' : 'B'+line, 'content' : grade.subject })
			.write({ 'cell' : 'C'+line, 'content' : grade.teacher })
			.write({ 'cell' : 'D'+line, 'content' : grade.date })
			.write({ 'cell' : 'E'+line, 'content' : grade.category })
			.write({ 'cell' : 'F'+line, 'content' : grade.type })
			.write({ 'cell' : 'G'+line, 'content' : grade.addedBy })
			.write({ 'cell' : 'H'+line, 'content' : grade.rawVal })
			.write({ "cell" : "I"+line, "content":grade.val === 0 ? 0 + "" : Number(grade.val) })
			.write({ "cell" : "J"+line, "content": "" + Number(weight)});
		line++;
	});
	let fileName = 'LibPLUS_user_data_' + new Date().getTime() + '.xlsx';
    excelPlus.saveAs(fileName);
    console.log('Generated file: ' + fileName);
}
function addExportToExcelButtonToPage() {
    $(".inside")
        .after('<div id="exportButton"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Eksportuj</span><span class="fold-end"></span></a></span></div>');
    $("#exportButton").click(function () {
        exportDataToExcel();
    });
}


