import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class HotsalesAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.registerEndpoint('comprar');
    }
    comprarHotsale() {
        return this.comprar.create({});
    }
}

class HotsalesAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient, HotsalesAPIClientDetail);
    }

    random() {
        return this.retrieve("random");
    }
}

export default HotsalesAPIClient;