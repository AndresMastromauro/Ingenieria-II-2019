import APIClient from './client/APIClient';

class GeoAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient);
        this.registerEndpoint("paises");
        this.registerEndpoint("provincias");
        this.registerEndpoint("localidades");
        this.registerEndpoint("calles");
    }
}

export default GeoAPIClient;