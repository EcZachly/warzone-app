let fetch;

if (typeof window !== 'undefined') {
    //browser
    fetch = require('unfetch');
} else {
    //server
    fetch = require('node-fetch').default;
}

const TypeService = require('./TypeService');

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PUBLIC METHODS


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
async function http(options) {
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
                    return `${key}=${val}`;
                }).join('&');

                url = url + '?' + encodeURI(stringParams);
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


            let method = options.method.toUpperCase();

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
                let status = responseData.status;

                response = {
                    status: responseData.status,
                    headers: _getAllHeaders(responseData),
                    statusText: responseData.statusText
                };

                const isJson = response.headers['content-type'].includes('application/json');

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
                const responseObject = {
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

export {http};


//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PRIVATE METHODS


/**
 *
 * @param {Object} responseData
 * @param {Array} responseData.headers
 * @private
 */
function _getAllHeaders(responseData: { headers }) {
    if (!TypeService.isObject(responseData)) {
        throw Error('responseData (Object) is required');
    }

    let headers = {};

    responseData.headers.forEach((value, name) => {
        headers[name] = value;
    });

    return headers;
}

export {_getAllHeaders};


export default {
    http: <Function>http,
    _getAllHeaders: <Function>_getAllHeaders,
}