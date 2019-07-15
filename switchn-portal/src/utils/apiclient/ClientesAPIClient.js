import APIClientDetail from './client/APIClientDetail';
import APIClient from './client/APIClient';

class ClientesAPIClientDetail extends APIClientDetail {
    constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
        super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
        this.registerEndpoint('subastas_ganadas');
        this.registerEndpoint('subastas_ofertadas');
        this.registerEndpoint('pagos');
        this.registerEndpoint('reservas');
        this.registerEndpoint('solicitud');
        // this.registerEndpoint('hotsales');
    }

    hacerSolicitud() {
        return this.aceptarSolicitud();
    }

    aceptarSolicitud() {
        return new Promise((resolve, reject) => {
            this.solicitud.create({})
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    rechazarSolicitud() {
        return new Promise((resolve, reject) => {
            this.solicitud.destroy('')
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
}

class ClientesAPIClient extends APIClient {
    constructor(sBaseURL, oHeaders, oHTTPClient) {
        super(sBaseURL, oHeaders, oHTTPClient, ClientesAPIClientDetail);
    }
}

export default ClientesAPIClient;