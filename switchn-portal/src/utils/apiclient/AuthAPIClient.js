import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class AuthAPIClient extends APIClient {
    login(sEmail, sPassword) {
        return this.client.post(
            this.baseURL.concat("login"),
            this.oHeaders,
            {
                username: sEmail,
                password: sPassword
            }
        );
    }
    logout(sEmail, sPassword) {
        return this.client.post(
            this.baseURL.concat("logout"),
            this.oHeaders
        );
    }
    getUserData() {
        return this.client.get(
            this.baseURL.concat("user"),
            this.oHeaders
        )
    }
}

export default AuthAPIClient;