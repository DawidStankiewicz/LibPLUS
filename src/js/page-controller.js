require('../css/libplus');

const $ = require("jquery");
const Mustache = require("mustache");
const template = require("../libplus-page.html");
const gradeUtilities = require("./grade-utils");

const containerId = 'libplus-container';

const pageController = {
    init: function (grades) {
        const container = `<div id="${containerId}"></div>`;
        const containerNeighbour = $('#grades').siblings().closest('h3.center');
        $(container).insertBefore(containerNeighbour);

        Mustache.parse(template);

        const gpa = gradeUtilities.calcGradePointAverage(grades);
        console.log(gpa);
        const data = {
            leftBoxContent: gpa,
            rightBoxContent: grades.length,
        }

        const rendered = Mustache.render(template, data);
        $(`#${containerId}`).html(rendered);
    }
}

module.exports = pageController;
