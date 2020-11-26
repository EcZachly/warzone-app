import TypeService from './TypeService';

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PUBLIC METHODS


type HttpRequestResponse = {
    status: number,
    data: any,
    response: Record<any, unknown>,
    ok: boolean,
    request: HttpRequestConfig
}


type HttpRequestConfig = {
    method: string,
    url: string,

    body?: Record<string, unknown>,
    data?: Record<string, unknown>,
    params?: Record<string, unknown>,
    parameters?: Record<string, unknown>,
    query?: Record<string, unknown>,
    header?: Record<string, unknown>,
    headers?: Record<string, unknown>,
    useDefaultHeaders?: boolean
}



/**
 *
 * @param {Object} options
 * @param {String} options.url
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} options.method
 * @param {Object} [options.body]
 * @param {Object} [options.data]
 * @param {Boolean} [options.useDefaultHeaders]
 * @param {Object} [options.query]
 *
 * @param {Object} [options.params]
 * @param {Object} [options.parameters]
 *
 * @param {Object} [options.headers]
 * @param {Object} [options.header]
 * @returns {Promise<any>}
 */
export async function http(options: HttpRequestConfig): Promise<HttpRequestResponse> {
    return new Promise(async (resolve, reject) => {
        const validMethods = ['GET', 'PUT', 'POST', 'DELETE'];

        if (TypeService.isObject(options) === false) {
            reject(new Error('options (Object) is required'));
        } else if (TypeService.isString(options.url) === false) {
            reject(new Error('options.url (String) is required'));
        } else if (TypeService.isString(options.method) === false) {
            reject(new Error('options.method (String) is required'));
        } else if (validMethods.includes(options.method.toUpperCase()) === false) {
            reject(new Error(`options.method must be one of the following values ${JSON.stringify(validMethods)}`));
        } else {
            options.useDefaultHeaders = (options.useDefaultHeaders !== false);


            let body = <any>undefined;

            if (TypeService.isObject(options.data)) {
                body = options.data;
            } else if (TypeService.isObject(options.body)) {
                body = options.body;
            }

            if (TypeService.isArray(body) || TypeService.isObject(body)) {
                body = JSON.stringify(body);
            }


            let url = options.url;
            let params = {};

            if (TypeService.isObject(options.params)) {
                params = options.params;
            } else if (TypeService.isObject(options.parameters)) {
                params = options.parameters;
            } else if (TypeService.isObject(options.query)) {
                params = options.query;
            }

            if (TypeService.isObject(params, true)) {
                const stringParams = Object.entries(params).map(([key, val]) => {
                    val = (TypeService.isArray(val) || TypeService.isObject(val)) ? JSON.stringify(val) : val;
                    return `${key}=${encodeURIComponent(val as any)}`;
                }).join('&');

                url = url + '?' + stringParams;
            }


            let headers = {};

            if (TypeService.isObject(options.headers)) {
                headers = options.headers;
            } else if (TypeService.isObject(options.header)) {
                headers = options.header;
            }

            if (options.useDefaultHeaders === true) {
                headers['accept'] = 'application/json';
                headers['content-type'] = 'application/json';
            }


            const method = options.method.toUpperCase();

            if (method === 'GET') {
                headers['Accept'] = 'application/x-www-form-urlencoded';
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }


            const isAbsoluteUrl = (url.substr(0, 4) === 'http');


            let response = <any>{};

            fetch(url, {
                method,
                headers,
                body
            }).then((responseData) => {
                const status = responseData.status;

                response = {
                    status: responseData.status,
                    headers: _getAllHeaders(responseData),
                    statusText: responseData.statusText
                };

                let isJson = false;

                try {
                    isJson = response.headers['content-type'].includes('application/json');
                } catch (e) {
                    isJson = false;
                }

                let jsonResponse = {};

                if (status === 204) {
                    jsonResponse = '';
                } else {
                    if (isJson) {
                        jsonResponse = responseData.json();
                    } else {
                        jsonResponse = responseData.text();
                    }
                }

                return jsonResponse;
            }).then((responseJson) => {
                const responseObject: HttpRequestResponse = {
                    status: response.status,
                    data: responseJson,
                    response: response,
                    ok: (response.status >= 200 && response.status < 300),
                    request: {
                        body: body,
                        method: method,
                        params: params,
                        url: url,
                        headers: headers
                    }
                };

                resolve(responseObject);
            }).catch(reject);
        }
    });
}


//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PRIVATE METHODS


/**
 *
 * @param {Object} responseData
 * @param {Array} responseData.headers
 * @private
 */
export function _getAllHeaders(responseData: { headers }) {
    if (!TypeService.isObject(responseData)) {
        throw Error('responseData (Object) is required');
    }

    const headers = {};

    responseData.headers.forEach((value, name) => {
        headers[name] = value;
    });

    return headers;
}



export default {
    http: http,
    _getAllHeaders: _getAllHeaders,
};