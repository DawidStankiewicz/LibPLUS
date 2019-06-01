const form = {
    login: 'login',
    pass: 'pass',
    autologin: 'autologin',
};

const menus = {
    hello: 'Popup__hello',
};

const popupHelloController = {
    initForm() {
        $('#loginForm').submit(event => {
            event.preventDefault();
            this.login();
        })
    },
    login() {
        const login = $(`#${form.login}`).val();
        const pass = $(`#${form.pass}`).val();
        const autologin = $(`#${form.autologin}`).prop('checked');
        if (!login || !pass) {
            return;
        }
        chrome.runtime.sendMessage({
            method: 'authorize', data: {
                login,
                pass,
                autologin
            }
        });
    },
    hideHelloMenu() {
        $(`.${menus.hello}`).fadeOut(100);
    },
    showHelloMenu() {
        $(`.${menus.hello}`).show();
    }
};

module.exports = popupHelloController;
