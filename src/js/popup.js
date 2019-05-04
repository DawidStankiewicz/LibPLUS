require("./analytics").init();
require("../css/popup.scss");
const $ = require("jquery");
const appVersion = chrome.runtime.getManifest().version;
const dataScraper = require('./data-scraper');
const gradeParser = require('./grade-parser.js');
const gradeUtilities = require('./grade-utils');
const pageController = require('./libplus-controller')
const axios = require('axios');

const popup = {
    init() {
        document.querySelector('.version').innerText = appVersion;
        const buttons = document.querySelectorAll('.Libplus__ga-item');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', this.trackButtonClick);
        }
        this.authorize();
        this.scrapData();
    },
    trackButtonClick(e) {
        const id = e.target.id;
        _gaq.push(['_trackEvent', id, 'clicked', appVersion]);
    },
    scrapData() {
        $.get('https://synergia.librus.pl/przegladaj_oceny/uczen', function (response) {
            response = response.replace(/<head>[.\w\W]*<\/head>/, '').replace(/<script.*\/?>(([.\w\W])*?)<\/script>/gm, '').replace(/<img/, /<div/);
            const page = $(response);
            dataScraper.initSelectors(page);
            this.subjects = dataScraper.getSubjects();
            const grades = dataScraper.getGrades();
            gradeParser.init(page);
            this.grades = gradeParser.parseAll(grades);
            const gpa = gradeUtilities.calcGradePointAverage(this.grades);
            sessionStorage.setItem('LIBPLUS_GRADES', JSON.stringify(this.grades));
            sessionStorage.setItem('LIBPLUS_SUBJECTS', JSON.stringify(this.subjects));
            pageController.init();
        });
    },
    authorize() {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const form = new FormData();
        form.append('action', 'login');
        form.append('login', 'demorodzic');
        form.append('pass', 'librus11');
        const getCookieURL = 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata';
        const postFormURL = 'https://api.librus.pl/OAuth/Authorization?client_id=46';
        const getGrantURL = 'https://api.librus.pl/OAuth/Authorization/Grant?client_id=46';
        let loginSuccess = false;
        axios.get(getCookieURL)
            .then(() => {
                return axios.post(postFormURL, form, config)
                    .then((response) => {
                        loginSuccess = true;
                        console.log('login success ? ', response.data.status === 'ok')
                    })
            })
            .then(() => {
                    return axios
                        .get(getGrantURL)
                        .then(response => {
                            loginSuccess = true;
                            console.log('last response ', response);
                        })
                }
            )
    }
}

window.onload = popup.init();

module.exports = popup;
