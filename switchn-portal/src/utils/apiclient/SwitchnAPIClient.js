import APIClient from './client/APIClient';
import PropiedadesAPIClient from './PropiedadesAPIClient';
import SubastasAPIClient from './SubastasAPIClient';
import ClientesAPIClient from './ClientesAPIClient';
import AuthAPIClient from './AuthAPIClient';


class SwitchnAPIClient extends APIClient {
    constructor(sBaseURL, oHTTPClient) {
        super(sBaseURL, undefined, oHTTPClient);
        this.registerEndpoint('propiedades', PropiedadesAPIClient);
        this.registerEndpoint('subastas', SubastasAPIClient);
        this.registerEndpoint('clientes', ClientesAPIClient);
        // this.auth = new AuthAPIClient(this.baseURL.concat('auth'));
        this.registerEndpoint('auth', AuthAPIClient);
    }

    login(sEmail, sPassword) {
        return this.auth.login(sEmail, sPassword)
            .then(data => {
                this.setHeader("Authorization", `Token ${data.token}`);
            })
            .catch(err => {
                console.log(err);
            });
    }

    logout() {
        return this.auth.logout()
            .then(
                () => {
                    this.removeHeader("Authorization");
                }
            ).catch(
                err => {
                    console.log(err);
            });
    }

    getUserData(sToken) {
        this.setHeader("Authorization", `Token ${sToken}`);
        return this.auth.getUserData();
    }
}

export default SwitchnAPIClient;