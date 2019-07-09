class _HTTPRequest extends Promise {
    constructor(oConfig) {
        this.oConfig = oConfig;
    }

    abort() {
        throw new Error("No implementado");
    }

    request() {
        throw new Error("No implementado");
    }

    extendURL(sExtension) {
        throw new Error("No implementado");
    }

    extendParams(oExtension) {
        throw new Error("No implementado");
    }
}

const HTTPRequest = new Proxy(
    _HTTPRequest,
    {
        get (request, prop) {
            if (prop in request) {
                return request[prop];
            }
            request.abort();
            extendURL(prop);
            request.request();
            return request;
        }
    }
);

export default HTTPRequest;