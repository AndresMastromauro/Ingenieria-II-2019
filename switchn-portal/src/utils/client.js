// import $ from 'jquery';

// const $ = require('/usr/lib/node_modules/jquery');
// const axios = require('/usr/lib/node_modules/axios');

// const appendSlash = (sURL) => !sURL.endsWith('/') ? sURL.concat('/') : sURL;

// class _HTTPRequest extends Promise {
//     constructor(oConfig) {
//         super(() => {});
//         this.oConfig = oConfig;
//     }

//     abort() {
//         throw new Error("No implementado");
//     }

//     request() {
//         throw new Error("No implementado");
//     }

//     extendURL(sExtension) {
//         throw new Error("No implementado");
//     }

//     extendParams(oExtension) {
//         throw new Error("No implementado");
//     }
// }

// const HTTPRequest = new Proxy(
//     _HTTPRequest,
//     {
//         get (request, prop) {
//             if (prop in request) {
//                 return request[prop];
//             }
//             request.abort();
//             extendURL(prop);
//             request.request();
//             return request;
//         }
//     }
// );

// class HTTPClient {
//     /***************
//      * Clase abstracta para el Cliente HTTP. Es simplemente un adaptador.
//      */
//     request(sMethod, sURL, oParams, oHeaders) {
//         /*****
//          * Hace un request HTTP con la configuración especificada.
//          * 
//          * @param String Método HTTP
//          * @param String URL sobre el cual se efectua el request
//          * @param Object Parámetros del request. Si es un método de escritura, oParams contendrá los datos.
//          * @param Object Encabezados HTTP
//          * 
//          * @return Promise
//          */
//         throw new Error("No implementado");
//     }
//     get(sURL, oHeaders, oParams) {
//         return this.request("GET", sURL, oParams, oHeaders);
//     }

//     post(sURL, oHeaders, oData) {
//         return this.request("POST", appendSlash(sURL), oData, oHeaders);
//     }

//     delete(sURL, oHeaders, oParams) {
//         return this.request("DELETE", appendSlash(sURL), oParams, oHeaders);
//     }

//     patch(sURL, oHeaders, oData) {
//         return this.request("PATCH", appendSlash(sURL), oData, oHeaders);
//     }

//     options(sURL, oHeaders, oParams) {
//         return this.request("OPTIONS", sURL, oParams, oHeaders);
//     }
// }

// class jQueryHTTPRequest extends HTTPRequest {
//     constructor(oConfig) {
//         super(oConfig);
//         this.request();
//     }

//     abort() {
//         this.xhr.abort();
//     }

//     request() {
//         this.xhr = $.ajax(this.oConfig)
//             .done(data => this.resolve(data))
//             .fail(xhr => this.reject(JSON.parse(xhr.responseText)));
//     }

//     extendURL(sExtension) {
//         if (!this.oConfig.url.endsWith('/')) {
//             this.oConfig.url = this.oConfig.url.concat('/')
//         }
//         if (sExtension.startsWith('/')) {
//             sExtension = sExtension.slice(1);
//         }
//         this.oConfig.url = this.oConfig.url.concat(sExtension);
//     }
// }

// class jQueryHTTPClient extends HTTPClient {
//     request(sMethod, sURL, oParams, oHeaders) {
//         var fnBeforeSend;
//         if (oHeaders) {
//             fnBeforeSend = xhr => {
//                 Object.keys(oHeaders).forEach(
//                     sHeaderName => {
//                         xhr.setRequestHeader(sHeaderName, oHeaders[sHeaderName]);
//                     }
//                 );
//             }
//         }
//         return new jQueryHTTPRequest({
//             url: sURL,
//             data: oParams && $.param(oParams) || {},
//             dataType: 'json',
//             method: sMethod,
//             beforeSend: fnBeforeSend
//         });
//     }
// }

// class AxiosHTTPRequest extends HTTPRequest {
//     constructor(oConfig) {
//         super(oConfig);
//         const CancelToken = axios.CancelToken;
//         this._source = CancelToken.source();
//         this.oConfig['cancelToken'] = this._source.token;
//         this.request();
//     }

//     abort() {
//         this._source.cancel()
//     }

//     request() {
//         this.xhr = axios(this.oConfig)
//             .then(response => Promise.resolve(response.data))
//             .catch(error => {
//                 if (!axios.isCancel(error)) {
//                     Promise.reject(error.response.data);
//                 }
//             });
//     }

//     extendURL(sExtension) {
//         if (!this.oConfig.url.endsWith('/')) {
//             this.oConfig.url = this.oConfig.url.concat('/')
//         }
//         if (sExtension.startsWith('/')) {
//             sExtension = sExtension.slice(1);
//         }
//         this.oConfig.url = this.oConfig.url.concat(sExtension);
//     }
// }

// class AxiosHTTPClient extends HTTPClient {
//     request(sMethod, sURL, oParams, oHeaders) {
//         var config = {
//             method: sMethod,
//             url: sURL,
//             responseType: 'json',
//             headers: oHeaders
//         };
//         switch (sMethod) {
//             case "POST":
//             case "PATCH":
//             case "PUT":
//                 config['data'] = oParams;
//                 break;
//             case "GET":
//             case "OPTIONS":
//             case "DELETE":
//                 config['params'] = oParams;
//         }
//         return new Promise(
//             (resolve, reject) => {
//                 axios(config)
//                     .then(response => resolve(response.data))
//                     .catch(error => reject(error.response.data));
//             }
//         );
//         // return new AxiosHTTPRequest(config);
//     }
// }


// class APIClient {
//     constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
//         this.baseURL = sBaseURL;
//         this.client = oHTTPClient || new AxiosHTTPClient(); // new jQueryHTTPClient();
//         this.oHeaders = oHeaders || {};
//         this.detailEndpointClass = detailEndpointClass || APIClient
//         this.endpoints = {};
//         console.log(this.baseURL);
//     }

//     set baseURL (sURL) {
//         if (!sURL.endsWith('/')) {
//             sURL = sURL.concat('/');
//         }
//         this._baseURL = sURL;
//     }
    
//     get baseURL () {
//         return this._baseURL;
//     }

//     registerEndpoint(sEndpointName, endpointClass = APIClient) {
//         if (sEndpointName in this.endpoints) {
//             throw new Error(`Ya existe el endpoint "${sEndpointName}"`);
//         }
//         const endpoint = new endpointClass(this.baseURL.concat(sEndpointName), this.oHeaders, this.client);
//         this.endpoints[sEndpointName] = endpoint;
//         this[sEndpointName] = endpoint;
//         return endpoint;
//     }

//     unregisterEndpoint(sEndpointName) {
//         if (! sEndpointName in this.endpoints) {
//             throw new Error(`No existe el endpoint ${sEndpointName}`);
//         }
//         delete this.endpoints[sEndpointName];
//         delete this[sEndpointName];
//     }

//     getDetailEndpoint(id) {
//         return new this.detailEndpointClass(this.baseURL.concat(id), this.oHeaders, this.client, this.detailEndpointClass);
//     }

//     setHeader(sHeaderName, sHeaderContent) {
//         this.oHeaders[sHeaderName] = sHeaderContent;
//         Object.keys(this.endpoints).forEach(
//             endpoint => this.endpoints[endpoint].setHeader(sHeaderName, sHeaderContent)
//         );
//     }

//     removeHeader(sHeaderName) {
//         delete this.oHeaders[sHeaderName];
//         Object.keys(this.endpoints).forEach(
//             endpoint => this.endpoints[endpoint].removeHeader(sHeaderName)
//         );
//     }

//     list() {
//         return this.client.get(this.baseURL, this.oHeaders);
//     }

//     retrieve(id) {
//         return this.client.get(this.baseURL.concat(id), this.oHeaders);
//     }

//     create(oData) {
//         return this.client.post(this.baseURL, this.oHeaders, oData);
//     }

//     update(id, oData) {
//         return this.client.update(this.baseURL.concat(id), this.oHeaders, oData);
//     }

//     destroy(id) {
//         return this.client.delete(this.baseURL.concat(id), this.oHeaders);
//     }

// }

// class APIClientDetail extends APIClient {
//     constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
//         super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
//         this.id = sBaseURL.split('/').pop();
//     }
// }

// class SubastasAPIClientDetail extends APIClientDetail {
//     constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
//         super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
//         this.registerEndpoint('ofertar');
//     }
//     cerrar() {
//         return this.destroy(this.id);
//     }
//     hacerOferta(dMonto) {
//         return this.ofertar.create({monto: dMonto});
//     }
// }

// class SubastasAPIClient extends APIClient {
//     constructor(sBaseURL, oHeaders, oHTTPClient) {
//         super(sBaseURL, oHeaders, oHTTPClient, SubastasAPIClientDetail);
//     }
// }

// class PropiedadesAPIClientDetail extends APIClientDetail {
//     constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
//         super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
//         this.registerEndpoint('subastas');
//         this.registerEndpoint('hotsales');
//     }
// }

// class PropiedadesAPIClient extends APIClient {
//     constructor(sBaseURL, oHeaders, oHTTPClient) {
//         super(sBaseURL, oHeaders, oHTTPClient, PropiedadesAPIClientDetail);
//     }
// }

// class ClientesAPIClientDetail extends APIClientDetail {
//     constructor(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass) {
//         super(sBaseURL, oHeaders, oHTTPClient, detailEndpointClass);
//         this.registerEndpoint('subastas_ganadas');
//         this.registerEndpoint('subastas_ofertadas');
//         this.registerEndpoint('pagos');
//         this.registerEndpoint('reservas');
//         // this.registerEndpoint('hotsales');
//     }
// }

// class ClientesAPIClient extends APIClient {
//     constructor(sBaseURL, oHeaders, oHTTPClient) {
//         super(sBaseURL, oHeaders, oHTTPClient, ClientesAPIClientDetail);
//     }
// }

// class AuthAPIClient extends APIClient {
//     login(sEmail, sPassword) {
//         return this.client.post(
//             this.baseURL.concat("login"),
//             this.oHeaders,
//             {
//                 username: sEmail,
//                 password: sPassword
//             }
//         );
//     }
//     logout(sEmail, sPassword) {
//         return this.client.post(
//             this.baseURL.concat("logout"),
//             this.oHeaders
//         );
//     }
// }

// class SwitchnAPIClient extends APIClient {
//     constructor(sBaseURL) {
//         super(sBaseURL);
//         this.registerEndpoint('propiedades', PropiedadesAPIClient);
//         this.registerEndpoint('subastas', SubastasAPIClient);
//         this.registerEndpoint('clientes', ClientesAPIClient);
//         // this.auth = new AuthAPIClient(this.baseURL.concat('auth'));
//         this.registerEndpoint('auth', AuthAPIClient);
//     }

//     login(sEmail, sPassword) {
//         return this.auth.login(sEmail, sPassword)
//             .then(data => {
//                 this.setHeader("Authorization", `Token ${data.token}`);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     logout() {
//         return this.auth.logout()
//             .then(
//                 () => {
//                     this.removeHeader("Authorization");
//                 }
//             ).catch(
//                 err => {
//                     console.log(err);
//                 }
//         );
//     }
// }

import SwitchnAPIClient from './apiclient/SwitchnAPIClient';
// import jQueryHTTPClient from './apiclient/http/jQueryHTTPClient';

const SwitchnAPI = new SwitchnAPIClient('/api'/* , new jQueryHTTPClient() */);

export { SwitchnAPI };
