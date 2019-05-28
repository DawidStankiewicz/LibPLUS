require("./analytics").init();
require("../css/popup.scss");
const $ = require("jquery");
const appVersion = chrome.runtime.getManifest().version;
const popupHelloController = require('./popup-hello-controller');
const libplusController = require('./libplus-controller');

const popupNav = 'Popup__nav';
const menus = {
    user: 'Popup__user',
};

const buttons = {
    logout: 'Popup-nav-logout',
};

const dataContainers = {
    username: $(`.Popup__nav-username`),
}

const popup = {

    async init() {
        document.querySelector('.Popup__version').innerText = `v${appVersion}`;
        this.initButtons();
        this.checkIfAuthorized()
            .then(authorized => {
                if (authorized) {
                    popupHelloController.hideHelloMenu();
                    popup.showUserMenu();
                    popup.showNavbar();
                }
            }, reason => {
                if (reason.message !== 'unauthorized') {
                    console.error(reason);
                }
            });
    },

    checkIfAuthorized() {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(['isAuthorized'], function (storage) {
                const {isAuthorized} = storage;
                if (isAuthorized) {
                    resolve(isAuthorized);
                } else {
                    reject(Error('unauthorized'));
                }
            })
        });

        return promise;
    },
    trackButtonClick(e) {
        const id = e.target.id;
        _gaq.push(['_trackEvent', id, 'clicked', appVersion]);
    },
    initButtons() {
        const gaButtons = document.querySelectorAll('.Libplus__ga-item');
        for (let i = 0; i < gaButtons.length; i++) {
            gaButtons[i].addEventListener('click', this.trackButtonClick);
        }
        $(`#${buttons.logout}`).click(function () {
            popup.logout();
        });
    },
    onLoginSuccess() {
        console.log('[LibPlus] login success!');
        popupHelloController.hideHelloMenu();
        popup.showNavbar();
        this.fetchData();
    },
    onLoginFailed(e) {
        console.log('[LibPlus] login failed!');
        popupHelloController.onLoginFailed(e);
    },
    showUserMenu() {
        popupHelloController.hideHelloMenu();
        $(`.${menus.user}`).fadeIn(0);
        popup.showData();
    },
    showData(updatedData) {
        if (updatedData) {
            libplusController.initPrepared(updatedData.grades, updatedData.gpa);
            dataContainers.username.text(updatedData.user);
            popup.showNotifications(updatedData);
            return;
        }
        const data = ['grades', 'gpa', 'user', 'events', 'announcements', 'messages'];
        chrome.storage.local.get(data, storage => {
            const {grades, gpa} = storage;
            console.log('show data: ', storage.gpa)
            libplusController.initPrepared(grades, gpa);
            dataContainers.username.text(storage.user);
            popup.showNotifications(storage);
        })
    },
    showNotifications(notifications) {
        const {
            messages,
            announcements,
            events
        } = notifications;
        const sum = messages + announcements + events;
        if (sum !== 0) {
            chrome.browserAction.setBadgeText({text: "" + sum});
        }
    },
    clearNotifications() {
        chrome.browserAction.setBadgeText({text: ""});
    },
    showNavbar() {
        $(`.${popupNav}`).slideDown(100);
    },
    hideNavbar() {
        $(`.${popupNav}`).slideUp(100);
    },
    hideUserMenu() {
        popupHelloController.showHelloMenu();
        $(`.${menus.user}`).hide();
    },
    logout() {
        chrome.storage.local.clear();
        popup.hideUserMenu();
        popup.hideNavbar();
        popup.clearNotifications();
    },
    fetchData() {
        chrome.runtime.sendMessage({
            method: 'fetchData',
        });
    },
    onDataUpdated(data) {
        popup.showData(data);
        $(`.${menus.user}`).fadeIn(0);
    }
}

chrome.runtime.onMessage.addListener(function (request) {
    switch (request.method) {
        case 'loginSuccess':
            popup.onLoginSuccess();
            break;
        case 'loginFailed':
            popup.onLoginFailed(request.data.errors);
            break;
        case 'onDataUpdated':
            popup.onDataUpdated(request.data.updatedData);
            break;
    }
    return true;
});

window.onload = popup.init();

module.exports = popup;
