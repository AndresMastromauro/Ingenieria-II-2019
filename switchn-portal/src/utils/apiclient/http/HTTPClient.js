const appendSlash = (sURL) => !sURL.endsWith('/') ? sURL.concat('/') : sURL;

class HTTPClient {
    /***************
     * Clase abstracta para el Cliente HTTP. Es simplemente un adaptador.
     */
    request(sMethod, sURL, oParams, oHeaders) {
        /*****
         * Hace un request HTTP con la configuración especificada.
         * 
         * @param String Método HTTP
         * @param String URL sobre el cual se efectua el request
         * @param Object Parámetros del request. Si es un método de escritura, oParams contendrá los datos.
         * @param Object Encabezados HTTP
         * 
         * @return Promise
         */
        throw new Error("No implementado");
    }
    get(sURL, oHeaders, oParams) {
        return this.request("GET", sURL, oParams, oHeaders);
    }

    post(sURL, oHeaders, oData) {
        return this.request("POST", appendSlash(sURL), oData, oHeaders);
    }

    delete(sURL, oHeaders, oParams) {
        return this.request("DELETE", appendSlash(sURL), oParams, oHeaders);
    }

    patch(sURL, oHeaders, oData) {
        return this.request("PATCH", appendSlash(sURL), oData, oHeaders);
    }

    options(sURL, oHeaders, oParams) {
        return this.request("OPTIONS", sURL, oParams, oHeaders);
    }
}

export default HTTPClient;