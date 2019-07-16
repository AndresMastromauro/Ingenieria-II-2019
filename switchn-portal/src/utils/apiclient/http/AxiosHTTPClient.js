import axios from 'axios';
import HTTPClient from './HTTPClient';

import { SHOW_OVERLAY, HIDE_OVERLAY } from '../../../redux/overlay/overlay';
import { store } from '../../../redux/store';

class AxiosHTTPClient extends HTTPClient {
    request(sMethod, sURL, oParams, oHeaders) {
        store.dispatch({type: SHOW_OVERLAY});
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
        return store.dispatch((dispatch, getState) => {
            return new Promise(
                (resolve, reject) => {
                    axios(config)
                        .then(response => resolve(response.data))
                        .catch(error => reject(error.response.data))
                        .finally(() => dispatch({type: HIDE_OVERLAY}));
                }
            );
        });
    }
}

export default AxiosHTTPClient;