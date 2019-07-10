import axios from 'axios';
import HTTPClient from './HTTPClient';

class AxiosHTTPClient extends HTTPClient {
    request(sMethod, sURL, oParams, oHeaders) {
        var config = {
            method: sMethod,
            url: sURL,
            responseType: 'json',
            headers: oHeaders
        };
        switch (sMethod) {
            case "POST":
            case "PATCH":
            case "PUT":
                config['data'] = oParams;
                break;
            case "GET":
            case "OPTIONS":
            case "DELETE":
                config['params'] = oParams;
        }
        return new Promise(
            (resolve, reject) => {
                axios(config)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error.response.data));
            }
        );
    }
}

export default AxiosHTTPClient;