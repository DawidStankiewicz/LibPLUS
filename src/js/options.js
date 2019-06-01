const dataScraper = require('./data-scraper');
const gradeParser = require('./grade-parser.js');
const gradeUtilities = require('./grade-utils');

let fileReader;

options = {
    onload() {
        console.log('options loaded');
        $('#debug-file-button').click(options.handleDebugFile);
    },
    handleDebugFile() {
        console.log('handle debug file');
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            console.log('The File APIs are not fully supported in this browser.');
            alert('The File APIs are not fully supported in this browser.');
            return;
        }

        let input = $('#debug-file-input');
        if (!input) {
            alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.prop('files')) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.prop('files')[0]) {
            alert("Please select a file before clicking 'Load'");
        }
        else {
            let file = input.prop('files')[0];
            console.log('file,',file);
            fileReader = new FileReader();
            fileReader.onload = options.recivedText;
            fileReader.readAsText(file);
            // fileReader.readAsDataURL(file);
        }
    },
    recivedText() {
        if (fileReader.error) {
            console.error('errors:', fileReader.error);
        }
        console.log(fileReader.result);


        const page = fileReader.result;
        const scrapedData = dataScraper.getData(page);
        gradeParser.init(page);
        const grades = gradeParser.parseAll(scrapedData.grades);
        const gpa = gradeUtilities.calcGradePointAverage(grades);

        console.log(`grades: ${grades.length}, gpa: ${gpa}`);
        console.log(grades)
    },
}

window.onload = options.onload;

module.exports = options;

