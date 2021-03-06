require('../css/libplus');
const authorizationService = require('./authorization-service');
const dataScraper = require('./data-scraper');
const gradeParser = require('./grade-parser.js');
const gradeUtilities = require('./grade-utils');
const axios = require('axios');

let updatesInterval;
const updatesIntervalTime = 60 * 60 * 1000; // 60 min

const backgroundService = {
    async init() {
        this.checkUpdates()
            .then(() => {
                console.log(`[LibPlus] Update done! Next in ${updatesIntervalTime / (60 * 1000)} min`);
                backgroundService.initIntervals();
            }, reason => {
                backgroundService.onCheckUpdatesFailed(reason);
            });
    },
    checkUpdates() {
        return this.isAuthorized()
            .then((authorized) => {
                if (!authorized) {
                    console.log('[LibPlus] Unauthorized !!! Reject check updates');
                    return Promise.reject('unauthorized');
                }
                return authorized;
            })
            .catch(reason => {
                if (reason === 'unauthorized') {
                    console.log(`[LibPlus] Unauthorized - Try auto-logging...`);
                    return backgroundService.autologin();
                }
            })
            .then((authorized) => {
                if (!authorized) {
                    return Promise.reject('unauthorized');
                }
                return backgroundService.fetchUpdates()
            });
    },
    wakeUp() {
        console.log(`[LibPlus] checking updates... (${new Date().toISOString()})`);

        backgroundService.checkUpdates()
            .catch(backgroundService.onCheckUpdatesFailed);
    },
    initIntervals() {
        updatesInterval = setInterval(() => {
            backgroundService.wakeUp();
        }, updatesIntervalTime);
    },
    onCheckUpdatesFailed(reason) {
        if (reason === 'unauthorized') {
            console.log(`[LibPlus] User is unauthorized - background is snoozed!`);
            return;
        } else {
            throw Error(reason);
        }
    },
    autologin() {
        const data = ['isAutologin', 'login', 'pass'];
        return new Promise(((resolve, reject) => {
            chrome.storage.local.get(data, storage => {
                let err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve(storage);
                }
            })
        })).then(storage => {
            const {isAutologin, login, pass} = storage;
            if (!isAutologin || !login || !pass) {
                return Promise.reject('credentials undefined');
            }
            return authorizationService.authorize(window.atob(login), windows.atob(pass));
        }).catch(reason => {
            console.log(`[LibPlus] autologin failed`);
            return false;
        });
    },
    fetchDataPage() {
        const dataURL = 'https://synergia.librus.pl/przegladaj_oceny/uczen';
        return axios.get(dataURL)
            .then(response => {
                // todo clear from useless things (images, scripts etc.)
                response.data
                    .replace(/<head>[.\w\W]*<\/head>/, '')
                    .replace(/<script.*\/?>(([.\w\W])*?)<\/script>/gm, '')
                    .replace(/<img/, '<div');
                return $(response.data);
            });
    },
    fetchUpdates() {
        console.log('[LibPlus] Fetching updates...');
        backgroundService.fetchDataPage()
            .then(page => {
                const scrapedData = dataScraper.getData(page);
                gradeParser.init(page);
                const grades = gradeParser.parseAll(scrapedData.grades);
                const gpa = gradeUtilities.calcGradePointAverage(grades);
                return {
                    grades,
                    gpa,
                    announcements: scrapedData.announcements,
                    events: scrapedData.events,
                    messages: scrapedData.messages,
                    user: scrapedData.user,
                    lastUpdateTime: new Date().getTime(),
                };
            })
            .catch(reason => {
                if (reason.message === 'unauthorized') {
                    backgroundService.onUnauthorized();
                }
                return Promise.reject(reason);
            })
            .then(updatedData => {
                return backgroundService.compareVersions(updatedData);
            }).then(updatedData => {
            chrome.storage.local.set(updatedData);
            chrome.runtime.sendMessage({
                method: 'onDataUpdated', data: {
                    updatedData
                }
            });
        });
    },
    compareVersions(updatedData) {
        const storedData = ['grades'];
        return new Promise(((resolve, reject) => {
            chrome.storage.local.get(storedData, storage => {
                let err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve(storage);
                }
            })
        }))
            .then(storage => {
                let isAnyChange = false;
                if (storage.grades) {
                    isAnyChange = (storage.grades &&
                        storage.grades.length === updatedData.grades.length) ||
                        updatedData.announcements ||
                        updatedData.messages ||
                        updatedData.events;
                }
                return {
                    ...updatedData,
                    isAnyChange
                };
            });
    },
    authorize(authData) {
        const {
            login,
            pass,
            autologin
        } = authData;
        return authorizationService.authorize(login, pass)
            .then(authorized => {
                if (authorized && autologin) {
                    chrome.storage.local.set({
                        isAutologin: true,
                        login: window.btoa(login),
                        pass: window.btoa(pass)
                    });
                }
                chrome.runtime.sendMessage({
                    method: 'loginSuccess'
                });
                return authorized;
            }, e => {
                chrome.runtime.sendMessage({
                    method: 'loginFailed', data: {
                        errors: e,
                    }
                });
                return false;
            })
            .then(isAuthorized => {
                chrome.storage.local.set({isAuthorized});
            });
    },
    isAuthorized() {
        return new Promise(((resolve, reject) => {
            const data = ['isAuthorized', 'lastUpdateTime'];
            chrome.storage.local.get(data, (storage) => {
                let err = chrome.runtime.lastError;
                const {isAuthorized } = storage;
                if (err) {
                    reject(err);
                } else if (isAuthorized === undefined) {
                    reject('empty');
                } else {
                    resolve(storage.isAuthorized);
                }
            })
        })).catch(reason => {
            if (reason === 'empty') {
                return authorizationService.isAuthorized();
            }
        }).then(function (authorized) {
            chrome.storage.local.set({'isAuthorized': authorized});
            return authorized;
        });
    },
    onUnauthorized() {
        chrome.storage.local.set({
            isAuthorized: false
        });
    }
};

chrome.runtime.onMessage.addListener((request) => {
    switch (request.method) {
        case 'authorize':
            backgroundService.authorize((request.data));
            break;
        case 'fetchData':
            backgroundService.fetchUpdates();
            break;
    }
    return true;
});

chrome.runtime.onStartup.addListener(() => {
    console.log('[LibPlus] start background script');
    backgroundService.init();
});

