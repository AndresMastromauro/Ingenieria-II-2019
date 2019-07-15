import AxiosHTTPClient from '../http/AxiosHTTPClient';
// import jQueryHTTPClient from '../http/jQueryHTTPClient';

class APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        this.baseURL = sBaseURL;
        this.client = oHTTPClient || new AxiosHTTPClient(); // new jQueryHTTPClient();
        this.oHeaders = oHeaders || {};
        this.detailEndpointClass = detailEndpointClass || APIClient
        this.endpoints = {};
        console.log(this.baseURL);
    }

    set baseURL (sURL) {
        if (!sURL.endsWith('/')) {
            sURL = sURL.concat('/');
        }
        this._baseURL = sURL;
    }
    
    get baseURL () {
        return this._baseURL;
    }

    registerEndpoint(sEndpointName, endpointClass = APIClient) {
        if (sEndpointName in this.endpoints) {
            throw new Error(`Ya existe el endpoint "${sEndpointName}"`);
        }
        const endpoint = new endpointClass(this.baseURL.concat(sEndpointName), this.oHeaders, this.client);
        this.endpoints[sEndpointName] = endpoint;
        this[sEndpointName] = endpoint;
        return endpoint;
    }

    unregisterEndpoint(sEndpointName) {
        if (! sEndpointName in this.endpoints) {
            throw new Error(`No existe el endpoint ${sEndpointName}`);
        }
        delete this.endpoints[sEndpointName];
        delete this[sEndpointName];
    }

    getDetailEndpoint(id) {
        return new this.detailEndpointClass(this.baseURL.concat(id), this.oHeaders, this.client, this.detailEndpointClass);
    }

    setHeader(sHeaderName, sHeaderContent) {
        // debugger;
        this.oHeaders[sHeaderName] = sHeaderContent;
        Object.keys(this.endpoints).forEach(
            endpoint => this.endpoints[endpoint].setHeader(sHeaderName, sHeaderContent)
        );
    }

    removeHeader(sHeaderName) {
        delete this.oHeaders[sHeaderName];
        Object.keys(this.endpoints).forEach(
            endpoint => this.endpoints[endpoint].removeHeader(sHeaderName)
        );
    }

    list(oParams) {
        return this.client.get(this.baseURL, this.oHeaders, oParams);
    }

    retrieve(id, oParams) {
        return this.client.get(this.baseURL.concat(id), this.oHeaders, oParams);
    }

    create(oData) {
        return this.client.post(this.baseURL, this.oHeaders, oData);
    }

    update(id, oData) {
        return this.client.patch(this.baseURL.concat(id), this.oHeaders, oData);
    }

    destroy(id) {
        return this.client.delete(this.baseURL.concat(id), this.oHeaders);
    }

<<<<<<< HEAD
    solicitud(id) {
        return this.client.post(this.baseURL.concat(id), this.oHeaders);
    }


=======
>>>>>>> 6319ff401284d18c63459a5c9a2a0fbfaba04828
}

export default APIClient;