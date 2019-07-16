import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class AdminsAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
    }

    deshabilitar() {
        return this.destroy(this.id);
    }

    
}

class AdminsAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient, AdminsAPIClientDetail);
    }
}

export default AdminsAPIClient;