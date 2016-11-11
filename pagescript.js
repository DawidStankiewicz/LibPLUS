window.onload = function (){
	/*
		weightedAvg = denominator / divider = (d1*w1 + d2*w2 + ... + di*wi) / (w1 + w2 + ... + wi) 
	
	*/ 
	var denominator = 0, divider = 0, weightedAvg;
	
	var index = 1;
	while ($("#Ocena" + index).html()!= null) {
		
		// get grade with html code
		gradeHTML = $("#Ocena" + index).html();
		
		// get only grade value
		grade = $("#Ocena" + index + "> a").html();
		
		// check if grade is only + or -
		if ((grade.search("-") != -1 | grade.search(/\+/g) != -1) && grade.length == 1) {
			// it's only '+' or '-' 
		} 
		else {		
			// check if grade has + or -
			if (grade.search(/\+/g) != -1 | grade.search("-") != -1 && grade.length > 1) {
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
			}
			
			// get grade weight
			gradeWeight = gradeHTML.substring(gradeHTML.indexOf("Waga:") + 6, gradeHTML.indexOf("Waga:") + 8);
			if (gradeWeight.substring(1,2) != 0) {
				gradeWeight = gradeWeight.substring(0,1);
			}
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
};

