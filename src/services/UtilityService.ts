import _ from 'lodash';

import TypeService from './TypeService';
import {IncomingMessage} from 'http';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



export function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (TypeService.isString(email)) {
        return re.test(email.trim());
    } else {
        return false;
    }
}



export function numberToPercentage(number, decimals) {
    return round(number * 100, decimals) + '%';
}



export function round(number, decimals) {
    return +(Math.round(number + ('e+' + decimals) as any) + 'e-' + decimals);
}



export function numberWithCommas(number: number = 0) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



export function getBaseUrlWithProtocol(request: IncomingMessage) {
    const host = request.headers.host;
    const protocol = host.includes('localhost') ? 'http://' : 'https://';
    return protocol + host;
}



export function camelToProperCase(string?: string) {
    return (string || '').split('_').map(_.capitalize).join(' ');
}

/**
 *
 * @param {*} item
 * @param {'undefined' | 'null' | 'object' | 'date' | 'boolean' | 'integer' | 'number' | 'function' | 'string' | 'array'} type
 * @param {*} [defaultValue]
 *
 * @returns {*}
 */
export function validateItem(item: any, type: string, defaultValue: any) {
    const typeMap = {
        'undefined': TypeService.isUndefined,
        'null': TypeService.isNull,
        'object': TypeService.isObject,
        'date': TypeService.isDate,
        'boolean': TypeService.isBoolean,
        'integer': TypeService.isInteger,
        'number': TypeService.isNumeric,
        'function': TypeService.isFunction,
        'string': TypeService.isString,
        'array': TypeService.isArray
    };

    const key = type.toLowerCase();

    if (typeMap[key]) {
        return (typeMap[key](item) === true) ? item : defaultValue;
    } else {
        console.log(item, type, defaultValue);
        throw new Error('invalid key');
    }
}


export function copyObject(value) {
    return {...{item: value}}['item'];
}



export default {
    validateItem,
    sleep,
    getBaseUrlWithProtocol,
    copyObject,
    isValidEmail,
    camelToProperCase,
    numberToPercentage,
    round,
    numberWithCommas
};