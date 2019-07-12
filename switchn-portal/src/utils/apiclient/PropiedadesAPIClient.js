import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class PropiedadesAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.registerEndpoint('subastas');
        this.registerEndpoint('hotsales');
        this.registerEndpoint('reservar');
    }

    getSemanasOcupadas() {
        return new Promise((resolve, reject) => {
            this.list({
                "include[]": 'semanas_reservadas',
                "exclude[]": "*"
            }).then(
                data => resolve(data.propiedad)
            ).catch(
                err => reject(err)
            )
        });
    }

    reservaDirecta(oData) {
        return this.reservar.create(oData);
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