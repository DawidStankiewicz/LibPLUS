require('../css/libplus');
require('../jquery/jquery-ui.min');
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

const libplusController = {
    init: function () {
        Mustache.parse(template);
        this.grades = JSON.parse(sessionStorage.getItem(sessionStorageKeys.grades));
        const gpa = gradeUtilities.calcGradePointAverage(libplusController.grades);
        const initData = {
            leftBoxContent: gpa,
            rightBoxContent: libplusController.grades.length,
        };
        this.initRender(initData);
        this.initButtons();
        this.initDatepickers();
        this.toggleButton(buttons.all);
    },
    initPrepared(grades, gpa) {
        this.grades = grades;
        this.gpa = gpa;

        Mustache.parse(template);
        this.initRender({
            leftBoxContent: gpa,
            rightBoxContent: grades.length,
        });

        this.initButtons();
        this.initDatepickers();
        this.toggleButton(buttons.all);
    },
    initButtons: function () {
        $(`.${buttons.all}`).click(this.allGradesMode);
        $(`.${buttons.firstTerm}`).click(this.firstTermMode);
        $(`.${buttons.secondTerm}`).click(this.secondTermMode);
        $(`.${buttons.period}`).click(this.periodMode);
        if (this.isAnyGradeOfType(gradeType.PROPOSED_FIRST)) {
            const firstTermProposedButton = $(`.${buttons.firstTermProposed}`);
            firstTermProposedButton.click(this.firstTermProposedMode);
            firstTermProposedButton.show();
        }
        if (this.isAnyGradeOfType(gradeType.END_FISRT)) {
            const firstTermEndButton = $(`.${buttons.firstTermEnd}`);
            firstTermEndButton.click(this.firstTermEndMode);
            firstTermEndButton.show();
        }
        if (this.isAnyGradeOfType(gradeType.PROPOSED_SECOND)) {
            const secondTermProposedButton = $(`.${buttons.secondTermProposed}`);
            secondTermProposedButton.click(this.secondTermProposedMode);
            secondTermProposedButton.show();
        }
        if (this.isAnyGradeOfType(gradeType.END_SECOND)) {
            const secondTermEndButton = $(`.${buttons.secondTermEnd}`);
            secondTermEndButton.click(this.secondTermEndMode);
            secondTermEndButton.show();
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
        const libplusDateForm = $("#Libplus-date-form");
        const libplusDateTo = $("#Libplus-date-to");
        libplusDateForm.val(savedDateFrom);
        libplusDateForm.datepicker({
            ...options,
            onSelect: libplusController.firstDateSelected
        });
        if (savedDateTo) {
            libplusDateTo.val(savedDateTo);
            libplusDateTo.prop('disabled', false);
        }
        libplusDateTo.datepicker({
            ...options,
            minDate: savedDateFrom ? savedDateFrom : options.minDate,
            onSelect: libplusController.secondDateSelected
        });
    },
    initRender: function (data) {
        const rendered = Mustache.render(template, data);
        $(`#${containerId}`).html(rendered);
        console.log('rendered template');
    },
    updateContent: function (data) {
        const leftBoxContentContainer = $(`.${content.leftBoxContent}`);
        const rightBoxContentContainer = $(`.${content.rightBoxContent}`);
        const initState = {
            leftBoxContent: leftBoxContentContainer.text(),
            rightBoxContent: rightBoxContentContainer.text()
        };
        leftBoxContentContainer.prop('value', initState.leftBoxContent).animate({
            value: data.leftBoxContent
        }, {
            duration: 500,
            easing: 'swing',
            step: function (now) {
                $(this).text((Math.ceil(now * 100) / 100).toFixed(2));
            }
        });
        rightBoxContentContainer.prop('value', initState.rightBoxContent).animate({
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
        for (let index in buttons) {
            if (buttons[index] === button) {
                $(`.${button}`).addClass(activeButtonClass);
            } else {
                $(`.${buttons[index]}`).removeClass(activeButtonClass);
            }
        }
    },
    toggleMenu: function (menu) {
        for (let index in menus) {
            if (menus[index] === menu) {
                $(`.${menu}`).slideDown();
            } else {
                $(`.${menus[index]}`).slideUp();
            }
        }
    },
    allGradesMode: function () {
        const gpa = gradeUtilities.calcGradePointAverage(libplusController.grades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: libplusController.grades.length,
        });
        libplusController.toggleButton(buttons.all);
        libplusController.toggleMenu();
    },
    firstTermMode: function () {
        const term = 1;
        const termGrades = libplusController.grades.filter(grade => grade.term === term);
        const gpa = gradeUtilities.calcGradePointAverage(termGrades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: termGrades.length,
        });
        libplusController.toggleButton(buttons.firstTerm);
        libplusController.toggleMenu(menus.firstTerm);
    },
    secondTermMode: function () {
        const term = 2;
        const termGrades = libplusController.grades.filter(grade => grade.term === term);
        const gpa = gradeUtilities.calcGradePointAverage(termGrades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: termGrades.length,
        });
        libplusController.toggleButton(buttons.secondTerm);
        libplusController.toggleMenu(menus.secondTerm);
    },
    periodMode: function () {
        libplusController.toggleButton(buttons.period);
        libplusController.toggleMenu(menus.peroid);
        if (libplusController.isPeroidSelected()) {
            libplusController.showFromPeriod();
        }
    },
    firstTermProposedMode: function () {
        libplusController.toggleButton(buttons.firstTermProposed);
        const proposedGrades = libplusController.grades.filter(grade =>
            grade.term === 1 &&
            grade.type === gradeType.PROPOSED_FIRST);
        const gpa = gradeUtilities.calcLinearGPA(proposedGrades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: proposedGrades.length
        });
    },
    firstTermEndMode: function () {
        libplusController.toggleButton(buttons.firstTermEnd);
        const endGrades = libplusController.grades.filter(grade =>
            grade.term === 1 &&
            grade.type === gradeType.END_FISRT);
        const gpa = gradeUtilities.calcLinearGPA(endGrades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: endGrades.length
        })
    },
    secondTermProposedMode: function () {
        libplusController.toggleButton(buttons.secondTermProposed);
        const proposedGrades = libplusController.grades.filter(grade =>
            grade.term === 2 &&
            grade.type === gradeType.PROPOSED_SECOND);
        const gpa = gradeUtilities.calcLinearGPA(proposedGrades);
        libplusController.updateContent({
            leftBoxContent: gpa,
            rightBoxContent: proposedGrades.length
        })
    },
    secondTermEndMode: function () {
        libplusController.toggleButton(buttons.secondTermEnd);
        const endGrades = libplusController.grades.filter(grade =>
            grade.type === gradeType.END_SECOND);
        const gpa = gradeUtilities.calcLinearGPA(endGrades);
        libplusController.updateContent({
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
        const maxDate = libplusController.getMaxDate();
        const libplusDateTo = $("#Libplus-date-to");
        libplusDateTo.prop("disabled", false);
        libplusDateTo.datepicker("setDate", null);
        libplusDateTo.datepicker("destroy");
        libplusDateTo.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate,
            maxDate,
            changeMonth: true,
            onSelect: libplusController.secondDateSelected
        });
    },
    secondDateSelected: function (date) {
        sessionStorage.setItem(sessionStorageKeys.dateTo, date);
        libplusController.showFromPeriod();
    },
    showFromPeriod: function () {
        const from = sessionStorage.getItem(sessionStorageKeys.dateFrom);
        const to = sessionStorage.getItem(sessionStorageKeys.dateTo);
        const selectedGrades = gradeUtilities.getGradesFromPeriod(libplusController.grades, from, to);
        const gpa = gradeUtilities.calcGradePointAverage(selectedGrades);
        libplusController.updateContent({
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
        return libplusController.grades.filter(grade => grade.type === type).length >= 1;
    }
};

module.exports = libplusController;
