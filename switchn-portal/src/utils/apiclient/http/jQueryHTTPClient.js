import $ from 'jquery';
import HTTPClient from './HTTPClient';
// import HTTPRequest from './HTTPRequest';

/* class jQueryHTTPRequest extends HTTPRequest {
    constructor(oConfig) {
        super(oConfig);
        this.request();
    }

    abort() {
        this.xhr.abort();
    }

    request() {
        this.xhr = $.ajax(this.oConfig)
            .done(data => this.resolve(data))
            .fail(xhr => this.reject(JSON.parse(xhr.responseText)));
    }

    extendURL(sExtension) {
        if (!this.oConfig.url.endsWith('/')) {
            this.oConfig.url = this.oConfig.url.concat('/')
        }
        if (sExtension.startsWith('/')) {
            sExtension = sExtension.slice(1);
        }
        this.oConfig.url = this.oConfig.url.concat(sExtension);
    }
} */

class jQueryHTTPClient extends HTTPClient {
    request(sMethod, sURL, oParams, oHeaders) {
        var fnBeforeSend;
        if (oHeaders) {
            fnBeforeSend = xhr => {
                Object.keys(oHeaders).forEach(
                    sHeaderName => {
                        xhr.setRequestHeader(sHeaderName, oHeaders[sHeaderName]);
                    }
                );
            }
        }
        return new Promise(
            function (resolve, reject) {
                $.ajax({
                    url: sURL,
                    data: oParams && $.param(oParams) || {},
                    dataType: 'json',
                    method: sMethod,
                    beforeSend: fnBeforeSend
                }).done(
                    data => {
                        debugger;
                        resolve(data);
                    }
                ).fail(
                    (xhr) => reject(JSON.parse(xhr.responseText))
                );
            }
        );
    }
}

export default jQueryHTTPClient;