import _ from 'lodash';

import TypeService from './TypeService';
import {IncomingMessage} from 'http';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export function sleep(milliseconds: number): void {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



export function isValidEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (TypeService.isString(email)) {
        return re.test(email.trim());
    } else {
        return false;
    }
}



export function numberToPercentage(number: number, decimals: number): string {
    return round(number * 100, decimals) + '%';
}



export function round(number: number, decimals: number): number {
    return +(Math.round(number + ('e+' + decimals) as any) + 'e-' + decimals);
}



export function numberWithCommas(number = 0): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



export function getBaseUrlWithProtocol(request: IncomingMessage): string {
    const host = request.headers.host;
    const protocol = host.includes('localhost') ? 'http://' : 'https://';
    return protocol + host;
}



export function camelToProperCase(string?: string): string {
    return (string || '').split('_').map(_.capitalize).join(' ');
}



export function validateItem(item: any, type: string, defaultValue: any): any {
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



export function copyObject(value: any): any {
    return {...{item: value}}['item'];
}



export function generateRandomNumberString(length: number): any {
    if (TypeService.isInteger(length, true) === false) {
        throw new Error('length (Integer) is required');
    }

    return repeatFunction(() => {
        return generateRandomInteger(0, 9);
    }, length).join('');
}



/**
 *
 * @param {Function} callback
 * @param {Number} count
 * @returns {Array}
 */
export function repeatFunction(callback: () => any, count: number): any[] {
    if (TypeService.isFunction(callback) === false) {
        throw new Error('callback (Function) is required');
    }

    if (TypeService.isInteger(count) === false) {
        throw new Error('count (Integer) is required');
    }

    const values = [];

    for (let i = 0; i < count; i++) {
        // @ts-ignore
        values.push(callback());
    }

    return values;
}



export function generateRandomInteger(min?: number, max?: number): number {
    min = validateItem(min, 'integer', 0);
    max = validateItem(max, 'integer', 9);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function isJson(item: any | string): boolean {
    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return true;
}



export function objectToUrlParameters(params: Record<any, string | number | boolean>): string {
    // @ts-ignore
    return Object.entries(params).filter(([key, val]) => !!val).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
}



export function sortArrayOfObjectsByKey(items: any[], key: string, descending = false): any[] {
    items = validateItem(items, 'array', []);

    return items.sort(function (a, b) {
        const valueA = _getValueForSorting(_.get(a, key));
        const valueB = _getValueForSorting(_.get(b, key));

        let comparison = 0;

        if (valueA > valueB) {
            comparison = -1;
        } else if (valueA < valueB) {
            comparison = 1;
        }

        return (descending === true) ? comparison : comparison * -1;
    });
}


function _getValueForSorting(value: any): any {
    if (TypeService.isNumeric(value)) {
        return Number(value);
    } else if (TypeService.isString(value)) {
        return value.toUpperCase();
    } else if (TypeService.isDate(value)) {
        return value.getTime();
    } else {
        return value;
    }
}



export default {
    validateItem,
    sleep,
    generateRandomNumberString,
    objectToUrlParameters,
    isJson,
    repeatFunction,
    generateRandomInteger,
    getBaseUrlWithProtocol,
    copyObject,
    sortArrayOfObjectsByKey,
    isValidEmail,
    camelToProperCase,
    numberToPercentage,
    round,
    numberWithCommas
};