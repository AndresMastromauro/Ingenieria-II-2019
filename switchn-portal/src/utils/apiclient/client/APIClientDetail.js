import APIClient from './APIClient';

class APIClientDetail extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.id = sBaseURL.split('/').pop();
    }
}

export default APIClientDetail;