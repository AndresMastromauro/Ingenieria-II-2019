import APIClient from './client/APIClient';
import PropiedadesAPIClient from './PropiedadesAPIClient';
import SubastasAPIClient from './SubastasAPIClient';
import ClientesAPIClient from './ClientesAPIClient';
import AuthAPIClient from './AuthAPIClient';
import GeoAPIClient from './GeoAPIClient';
import HotsalesAPIClient from './HotsalesAPIClient';
import AdminsAPIClient from './AdminsAPIClient';


class SwitchnAPIClient extends APIClient {
    constructor(sBaseURL, oHTTPClient) {
        super(sBaseURL, undefined, oHTTPClient);
        this.registerEndpoint('hotsales', HotsalesAPIClient);
        this.registerEndpoint('propiedades', PropiedadesAPIClient);
        this.registerEndpoint('subastas', SubastasAPIClient);
        this.registerEndpoint('clientes', ClientesAPIClient);
        this.registerEndpoint('geo', GeoAPIClient);
        this.registerEndpoint('auth', AuthAPIClient);
        this.registerEndpoint('switchn_users', AdminsAPIClient);
    }

    login(sEmail, sPassword) {
        return new Promise((resolve, reject) => {
            this.auth.login(sEmail, sPassword)
                .then(data => {
                    this.setHeader("Authorization", `Token ${data.token}`);
                    resolve(data);
                })
                .catch(err => {
                    alert('Algo salió mal. Verifica los datos y vuelve a intentarlo');
                    reject(err);
                })
            }
        );
    }

    logout() {
        return new Promise((resolve, reject) => {
            this.auth.logout()
                .then((data) => {
                    this.removeHeader("Authorization");
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            }
        );
    }

    getUserData(sToken) {
        this.setHeader("Authorization", `Token ${sToken}`);
        return this.auth.getUserData();
    }
}

export default SwitchnAPIClient;