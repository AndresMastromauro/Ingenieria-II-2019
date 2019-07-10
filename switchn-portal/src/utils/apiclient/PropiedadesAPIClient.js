import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class PropiedadesAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.registerEndpoint('subastas');
        this.registerEndpoint('hotsales');
    }
}

class PropiedadesAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient, PropiedadesAPIClientDetail);
    }

    random() {
        return this.retrieve("random");
    }
}

export default PropiedadesAPIClient