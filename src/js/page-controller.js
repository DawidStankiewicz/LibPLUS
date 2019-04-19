require('../css/libplus');
require('../jquery/jquery-ui.min')
const $ = require("jquery");
const Mustache = require("mustache");
const template = require("../libplus-page.html");
const gradeUtilities = require("./grade-utils");
const {gradeType} = require('./patterns');


const containerId = 'Libplus';
const activeButtonClass = 'Libplus__button--active';

const sessionStorageKeys = {
    grades: 'LIBPLUS_GRADES',
    dateFrom: 'LIBPLUS_DATE_FROM',
    dateTo: 'LIBPLUS_DATE_TO',
};

const content = {
    leftBoxContent: 'Libplus__box--left-content',
    rightBoxContent: 'Libplus__box--right-content',
};

const buttons = {
    all: 'Libplus__button--all',
    firstTerm: 'Libplus__button--term-1',
    firstTermProposed: 'Libplus__button--term-1-proposed',
    firstTermEnd: 'Libplus__button--term-1-end',
    secondTerm: 'Libplus__button--term-2',
    secondTermProposed: 'Libplus__button--term-2-proposed',
    secondTermEnd: 'Libplus__button--term-2-end',
    period: 'Libplus__button--period',
};

const menus = {
    peroid: 'Libplus__menu-period',
    firstTerm: 'Libplus__menu-term-1',
    secondTerm: 'Libplus__menu-term-2',
};

let grades;

const pageController = {
    init: function () {
        grades = JSON.parse(sessionStorage.getItem(sessionStorageKeys.grades));
        const container = `<div id="${containerId}"></div>`;
        const containerNeighbour = $('#grades').siblings().closest('h3.center');
        $(container).insertBefore(containerNeighbour);
        Mustache.parse(template);
        this.allGradesMode();
        this.initRender();
        this.initButtons();
        this.initDatepickers();
    },
    initButtons: function () {
        $(`.${buttons.all}`).click(this.allGradesMode);
        $(`.${buttons.firstTerm}`).click(this.firstTermMode);
        $(`.${buttons.secondTerm}`).click(this.secondTermMode);
        $(`.${buttons.period}`).click(this.periodMode);

        if (this.isAnyGradeOfType(gradeType.PROPOSED_FIRST)) {
            $(`.${buttons.firstTermProposed}`).click(this.firstTermProposedMode);
            $(`.${buttons.firstTermProposed}`).show();
        }
        if (this.isAnyGradeOfType(gradeType.END_FISRT)) {
            $(`.${buttons.firstTermEnd}`).click(this.firstTermEndMode);
            $(`.${buttons.firstTermEnd}`).show();
        }
        if (this.isAnyGradeOfType(gradeType.PROPOSED_SECOND)) {
            $(`.${buttons.secondTermProposed}`).click(this.secondTermProposedMode);
            $(`.${buttons.secondTermProposed}`).show();
        }
        if (this.isAnyGradeOfType(gradeType.END_SECOND)) {
            $(`.${buttons.secondTermEnd}`).click(this.secondTermEndMode);
            $(`.${buttons.secondTermEnd}`).show();
        }
    },
    initDatepickers: function () {
        const minDate = this.getMinDate();
        const maxDate = this.getMaxDate();
        const savedDateFrom = sessionStorage.getItem(sessionStorageKeys.dateFrom);
        const savedDateTo = sessionStorage.getItem(sessionStorageKeys.dateTo);
        const options = {
            dateFormat: 'yy-mm-dd',
            altFormat: 'dd-mm-yy',
            minDate,
            maxDate,
            changeMonth: true,
        };
        $("#Libplus-date-form").val(savedDateFrom);
        $("#Libplus-date-form").datepicker({
            ...options,
            onSelect: pageController.firstDateSelected
        });
        if (savedDateTo) {
            $("#Libplus-date-to").val(savedDateTo);
            $("#Libplus-date-to").prop('disabled', false);
        }
        $("#Libplus-date-to").datepicker({
            ...options,
            minDate: savedDateFrom ? savedDateFrom : options.minDate,
            onSelect: pageController.secondDateSelected
        });
    },
    initRender: function () {
        const gpa = gradeUtilities.calcGradePointAverage(grades);
        const data = {
            leftBoxContent: gpa,
            rightBoxContent: grades.length,
        }
        const rendered = Mustache.render(template, data);
        $(`#${containerId}`).html(rendered);
    },
    updateContent: function (data) {
        const initState = {
            leftBoxContent: $(`.${content.leftBoxContent}`).text(),
            rightBoxContent: $(`.${content.rightBoxContent}`).text()
        };
        $(`.${content.leftBoxContent}`).prop('value', initState.leftBoxContent).animate({
            value: data.leftBoxContent
        }, {
            duration: 500,
            easing: 'swing',
            step: function (now) {
                $(this).text((Math.ceil(now * 100) / 100).toFixed(2));
            }
        });
        $(`.${content.rightBoxContent}`).prop('value', initState.rightBoxContent).animate({
            value: data.rightBoxContent
        }, {
            duration: 500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    },
    toggleButton: function (button) {
        for (index in buttons) {
            if (buttons[index] === button) {
                $(`.${button}`).addClass(activeButtonClass);
            } else {
                $(`.${buttons[index]}`).removeClass(activeButtonClass);
            }
        }
    },
    toggleMenu: function (menu) {
        for (index in menus) {
            if (menus[index] === menu) {
                $(`.${menu}`).slideDown();
            } else {
                $(`.${menus[index]}`).slideUp();
            }
        }
    },
    allGradesMode: function () {
        const gpa = gradeUtilities.calcGradePointAverage(grades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: grades.length,
        });
        pageController.toggleButton(buttons.all);
        pageController.toggleMenu();
    },
    firstTermMode: function () {
        const term = 1;
        const termGrades = grades.filter(grade => grade.term == term);
        const gpa = gradeUtilities.calcGradePointAverage(termGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: termGrades.length,
        })
        pageController.toggleButton(buttons.firstTerm);
        pageController.toggleMenu(menus.firstTerm);
    },
    secondTermMode: function () {
        const term = 2;
        const termGrades = grades.filter(grade => grade.term == term);
        const gpa = gradeUtilities.calcGradePointAverage(termGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: termGrades.length,
        })
        pageController.toggleButton(buttons.secondTerm);
        pageController.toggleMenu(menus.secondTerm);
    },
    periodMode: function () {
        pageController.toggleButton(buttons.period);
        pageController.toggleMenu(menus.peroid);
        if (pageController.isPeroidSelected()) {
            pageController.showFromPeriod();
        }
    },
    firstTermProposedMode: function () {
        pageController.toggleButton(buttons.firstTermProposed);
        const proposedGrades = grades.filter(grade =>
            grade.term === 1 &&
            grade.type === gradeType.PROPOSED_FIRST);
        const gpa = gradeUtilities.calcLinearGPA(proposedGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: proposedGrades.length
        })
    },
    firstTermEndMode: function () {
        pageController.toggleButton(buttons.firstTermEnd);
        const endGrades = grades.filter(grade =>
            grade.term === 1 &&
            grade.type === gradeType.END_FISRT);
        const gpa = gradeUtilities.calcLinearGPA(endGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: endGrades.length
        })
    },
    secondTermProposedMode: function () {
        pageController.toggleButton(buttons.secondTermProposed);
        const proposedGrades = grades.filter(grade =>
            grade.term === 2 &&
            grade.type === gradeType.PROPOSED_SECOND);
        const gpa = gradeUtilities.calcLinearGPA(proposedGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: proposedGrades.length
        })
    },
    secondTermEndMode: function () {
        pageController.toggleButton(buttons.secondTermEnd);
        const endGrades = grades.filter(grade =>
            grade.term === 2 &&
            grade.type === gradeType.END_SECOND);
        const gpa = gradeUtilities.calcLinearGPA(endGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: endGrades.length
        })
    },
    isPeroidSelected: function () {
        const from = sessionStorage.getItem(sessionStorageKeys.dateFrom);
        const to = sessionStorage.getItem(sessionStorageKeys.dateTo);
        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            return !isNaN(fromDate.getTime()) && !isNaN(toDate.getTime());
        }
        return false;
    },
    firstDateSelected: function (date) {
        sessionStorage.setItem(sessionStorageKeys.dateFrom, date);
        const minDate = new Date(date);
        const maxDate = pageController.getMaxDate();
        $("#Libplus-date-to").prop("disabled", false);
        $("#Libplus-date-to").datepicker("setDate", null);
        $("#Libplus-date-to").datepicker("destroy");
        $("#Libplus-date-to").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate,
            maxDate,
            changeMonth: true,
            onSelect: pageController.secondDateSelected
        });
    },
    secondDateSelected: function (date) {
        sessionStorage.setItem(sessionStorageKeys.dateTo, date);
        pageController.showFromPeriod();
    },
    showFromPeriod: function () {
        const from = sessionStorage.getItem(sessionStorageKeys.dateFrom);
        const to = sessionStorage.getItem(sessionStorageKeys.dateTo);
        const selectedGrades = gradeUtilities.getGradesFromPeriod(grades, from, to);
        const gpa = gradeUtilities.calcGradePointAverage(selectedGrades);
        pageController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: selectedGrades.length
        })
    },
    getMinDate: function () {
        const now = new Date();
        const month = now.getMonth() + 1;
        let minYear = now.getFullYear();
        if (month < 9) {
            minYear--;
        }
        const firstSchoolDay = `${minYear}-09-01`;
        return new Date(firstSchoolDay);
    },
    getMaxDate: function () {
        const now = new Date();
        const month = now.getMonth() + 1;
        let maxYear = now.getFullYear();
        if (month >= 9) {
            maxYear++;
        }
        const lastSchoolDay = `${maxYear}-08-31`;
        return new Date(lastSchoolDay);
    },
    isAnyGradeOfType: function (type) {
        return grades.filter(grade => grade.type === type).length >= 1;
    }
}

module.exports = pageController;
