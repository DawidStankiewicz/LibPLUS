/*
 * Author: Dawid Stankiewicz
 * theszczypiorek[ at ]gmail.com
 * github.com/Szczypioreg
 * 
 * LibPLUS
 * Version: 1.2 - 02.12.2016 
 * 
 */ 

 
 
/*
 * Objects 
 */ 
function Grade(id, fullVal, val, subject) {
	this.id = id;
	this.fullVal = fullVal;
	this.val = val;
	this.subject = subject;
}
function Subject(id, avg, numberOfGrades) {
	this.id = id;
	this.avg = avg;
	this.numberOfGrades = numberOfGrades;
}



/*
 * Global variables
 */ 
grades = [], subjects = [];
numberOfAllGrades = countGrades();
// eg. 3.02564865545 to 3.03 
const displayPrecisionOfFloatNumber = 2;



window.onload = function main(){
	createContainersOnPage();
	calculateAndDisplayTheAverage();
	setNumberOfGradesOnPage(numberOfAllGrades);
	
	createUpdateButton();
} 

function calculateAndDisplayTheAverage() {
	/*
		weightedAvg = sumOfProductsGradesAndWeights / sumOfWeights = 
					= (d1*w1 + d2*w2 + ... + di*wi) / (w1 + w2 + ... + wi) 
	*/ 
	let sumOfProductsGradesAndWeights = 0, sumOfWeights = 0;
	
	let weightedAvg=0, gradeId = 1, subjectId = 0, numberOfSubjectsWithAvg = 0;
	while (isGradeExist(gradeId)) {
		dataOfGrade = getGradeHTMLData(gradeId);
		grade = getGradeValue(gradeId);
		
		if (isNumberWithPlusOrMinus(grade)) {
			if (hasPlusOrMinus(grade)) {
				grade = convertGradeToNumber(grade); // eg from 4+ convert to 4.5 or 4- convet to 3.75
			}	
			gradeWeight = getGradeWeight(dataOfGrade); // get grade weight
			sumOfProductsGradesAndWeights += (grade*gradeWeight); // now when we have grade and weight we can count
			sumOfWeights += Number(gradeWeight);
		}
		gradeId++;
		if (!isNextGradeOfSubject(gradeId-1)) {
			subjectId++;
			subject = subjects[subjectId] = new Subject(subjectId);
			if (!isNaN(sumOfProductsGradesAndWeights / sumOfWeights)) {
				numberOfSubjectsWithAvg++;
				subject.avg = sumOfProductsGradesAndWeights / sumOfWeights;
				setAvgOfSubjectOnPage(subjectId, subject.avg.toFixed(displayPrecisionOfFloatNumber));
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
	setAvgValueOfUserOnPage(weightedAvg.toFixed(displayPrecisionOfFloatNumber));
}

function createContainersOnPage() {
	/* 
	 * Add container for student avg (#studentAvg) and number of all grades (#numberOfAllGrades).
	 */
	$(".container-icon > table > tbody > tr > td").last()
	.after('<td><p><b>Średnia: </b><span id="studentAvg">!</span><br /><b>Wszystkich ocen: </b><span id="numberOfAllGrades">!</span></p></td>');
	
	/*
	 * Add containers for the avg of subjects (#avgSubject[id])
	 */
	let gradeId = 0, subjectId = 0;
	while (isGradeExist(gradeId)) {
		gradeId++;
		if (!isNextGradeOfSubject(gradeId)) {
			subjectId++;
			$("#Ocena" + (gradeId)).parent().next().append('<span id="avgSubject'+subjectId+'"> ! </span>');
		}
	}
}

function updateAll() {
	grades = [], subjects = [];
	numberOfAllGrades = countGrades();
	calculateAndDisplayTheAverage();
	setNumberOfGradesOnPage(numberOfAllGrades);
	console.log("updated");
}

function setAvgOfSubjectOnPage(subjectId, avg) {
	$("#avgSubject" + subjectId).text(avg);
}

function createUpdateButton() {
	$(".inside")
	.after('<div id="updateButton"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Update</span><span class="fold-end"></span></a></span></div>');
	$( "#updateButton" ).click(function() {
		updateAll();
	});
}

function setAvgValueOfUserOnPage(avg) {
	$("#studentAvg").text(avg);	
}

function setNumberOfGradesOnPage(num) {
	$("#numberOfAllGrades").text(num);	
}

/*
 * get grade with html code and all data
 */
function getGradeHTMLData(id) {
	return $("#Ocena" + id).html();
}

/*
 * get only grade value
 */
function getGradeValue(id) {
	return $("#Ocena" + id + "> a").html();
}

function hasPlusOrMinus(grade) {
	if (grade.search(/\+/g) != -1 | grade.search("-") != -1 && grade.length > 1) {
		return true;
	}
	return false;
}

function isNumberWithPlusOrMinus(grade) {
	if (hasPlusOrMinus(grade)) {
		grade = grade.replace(/\+/g,'');
		grade = grade.replace('-','');
	}
	return !isNaN(grade);
}

// check if grade exist
function isGradeExist(id) {
	if ($("#Ocena" + id).html()== null) {
		return false;
	}
	return true;
}

function isNextGradeOfSubject(gradeIndex) {
	if (typeof $("#Ocena" + gradeIndex).next().html() !== "undefined") {
		return true;
	}
	return false;
}

// remove '+' and '-' 
function convertGradeToNumber(grade) {
	// if grade has '+' remove it and add 0.5
	if (grade.search(/\+/g) != -1) {
		grade = Number(grade.replace(/\+/g,''));
		grade += 0.5; 
	}
	// if grade has '-' remove it and subtract 0.25
	else if (grade.search("-") != -1) {
		grade = Number(grade.replace('-', ''));
		grade -= 0.25; 
	}
	return grade;
}

/* 
 * Get weight of grade from HTML (grade data).
 */
function getGradeWeight(dataGrade){
	let gradeWeight = 0;
	// check if weight exist
	if (dataGrade.indexOf("Waga:")!==-1) {
		gradeWeight = dataGrade.substring(dataGrade.indexOf("Waga:") + 6, dataGrade.indexOf("Waga:") + 8);
		// check if grade has '<' and remove if has 
		if (gradeWeight.substring(1,2) != 0) {
			gradeWeight = gradeWeight.substring(0,1);
		}
	}
	return gradeWeight;
}

function countGrades(id) {
	let counter = 0, gradeId = 0;
	while (isGradeExist(gradeId)) {
		counter++;
		gradeId++;
	}
	return counter;
}