const form = {
    login: 'login',
    pass: 'pass',
    autologin: 'autologin',
}

const menus = {
    hello: 'Popup__hello',
};

class PopupHelloController {

    constructor() {
        this.initForm();
    }

    initForm() {
        $('#loginForm').submit(event => {
            event.preventDefault();
            this.login();
        })
    }

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
    }

    onLoginFailed(e) {
        // todo show errors
        console.error(e);
    }

    hideHelloMenu() {
        $(`.${menus.hello}`).fadeOut(100);
    }


    showHelloMenu() {
        $(`.${menus.hello}`).show();
    }
}

const popupHelloController = new PopupHelloController();

module.exports = popupHelloController;
