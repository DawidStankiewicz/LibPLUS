window.onload = function init(){
	calculateAndDisplayTheAverage();
	calculateAndDisplaySubjectsAverage();
};

function calculateAndDisplayTheAverage() {
	/*
		weightedAvg = denominator / divider = (d1*w1 + d2*w2 + ... + di*wi) / (w1 + w2 + ... + wi) 
	
	*/ 
	var denominator = 0, divider = 0, weightedAvg, index = 1;
	while ($("#Ocena" + index).html()!= null) {
		
		// get grade with html code
		dataGrade = $("#Ocena" + index).html();
		
		// get only grade value
		grade = $("#Ocena" + index + "> a").html();
		
		if (!isPlusOrMinus(grade)) {
			if (hasPlusOrMinus(grade)) {
				grade = convertGradeToNumber(grade);
			}	
			// get grade weight
			gradeWeight = getGradeWeight(dataGrade);

			// Now when we have grade and weight we can count
			denominator = denominator + (grade*gradeWeight);
			divider = divider + Number(gradeWeight);
		}
		index++;
	}
	if (divider > 0) {
		weightedAvg = denominator / divider;
	}
	console.log("Your avg: " + weightedAvg);
	gradesCounter = index - 1;
	$(".container-icon > table > tbody > tr > td").last().after("<td><p><b>Średnia: </b>" + weightedAvg.toFixed(3) + "<br /><b>Wszystkich ocen: </b>" + gradesCounter + "</p></td>");
}

function calculateAndDisplaySubjectsAverage() {
	var gradeIndex = 1, subjectIndex = 1;
	
	while ($("#Ocena" + gradeIndex).html()!= null) {	
		// Average of one subject
		var denominator = 0, divider = 0, avgOfSubject = 0, gradeOfSubject = 0;
		
		do {
			// get grade with html code
			dataGrade = $("#Ocena" + gradeIndex).html();
			
			// get only grade value
			grade = $("#Ocena" + gradeIndex + "> a").html();
			
			if (!isPlusOrMinus(grade)) {
				if (hasPlusOrMinus(grade)) {
					grade = convertGradeToNumber(grade);
				}	
				// get grade weight
				gradeWeight = getGradeWeight(dataGrade);

				// Now when we have grade and weight we can count
				denominator = denominator + (grade*gradeWeight);
				divider = divider + Number(gradeWeight);
			}
			gradeIndex++;
			gradeOfSubject++;
		} 
		// check if next grade exist. gradeIndex
		while(isNextGradeOfSubject(gradeIndex-1));
		
		if (divider > 0) {
			avgOfSubject = denominator / divider;
		}
		
		// console.log(subjectIndex + " subject: avg= " + avgOfSubject + " grades=" + gradeOfSubject);
		$("#Ocena" + (gradeIndex-1)).parent().next().append(" " + avgOfSubject.toFixed(2));
		subjectIndex++;
	}
}
/*
function createUpdateButton() {
	$(".inside").after('<div id="updateButton"><span class="fold"><a href="#" class="fold-link"><span class="fold-start">Aktualizuj średnią</span><span class="fold-end"></span></a></span></div>');
	$( "#updateButton" ).click(function() {
		calculateAndDisplayTheAverage();
		calculateAndDisplaySubjectsAverage();
	});
}
*/

function isPlusOrMinus(grade) {
	if ((grade.search("-") != -1 | grade.search(/\+/g) != -1) && grade.length == 1) {
		return true;
	} 
	return false;
}
function hasPlusOrMinus(grade) {
	if (grade.search(/\+/g) != -1 | grade.search("-") != -1 && grade.length > 1) {
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

// get weight of grade from HTML
function getGradeWeight(dataGrade){
	gradeWeight = dataGrade.substring(dataGrade.indexOf("Waga:") + 6, dataGrade.indexOf("Waga:") + 8);
	if (gradeWeight.substring(1,2) != 0) {
		gradeWeight = gradeWeight.substring(0,1);
	}
	return gradeWeight;
}
function isNextGradeOfSubject(gradeIndex) {
	if (typeof $("#Ocena" + gradeIndex).next().html() !== "undefined") {
		return true;
	}
	return false;
}
