import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class SubastasAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.registerEndpoint('ofertar');
    }
    cerrar() {
        return this.destroy(this.id);
    }
    hacerOferta(dMonto) {
        return this.ofertar.create({monto: dMonto});
    }
}

class SubastasAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient, SubastasAPIClientDetail);
    }
}

export default SubastasAPIClient;