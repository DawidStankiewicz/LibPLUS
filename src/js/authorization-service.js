const axios = require('axios');

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};

const url = {
    getCookie: 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
    postForm: 'https://api.librus.pl/OAuth/Authorization?client_id=46',
    getGrant: 'https://api.librus.pl/OAuth/Authorization/Grant?client_id=46',
    isAuthorized: 'https://synergia.librus.pl/przegladaj_oceny/uczen',
}

const authorizationService = {

    authorize(login, password) {

        const form = new FormData();
        form.append('action', 'login');
        form.append('login', login);
        form.append('pass', password);

        return axios.get(url.getCookie)
            .then(() => {
                return axios.post(url.postForm, form, config);
            })
            .then((response) => {
                loginSuccess = response.data.status === 'ok';
                if (!loginSuccess) {
                    return Promise.reject(Error('failed'));
                }
            })
            .then(() => {
                    return axios.get(url.getGrant)
                }
            ).then(() => {
                return true;
            });
    },

    async isAuthorized() {
        return axios.get(url.isAuthorized)
            .then(response => {
                return response.data.indexOf('jesteś zalogowany jako:') !== -1;
            });
    }
}

module.exports = authorizationService;
