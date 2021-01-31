import UtilityService from './../../services/UtilityService';
import TypeService from './../../services/TypeService';

try {
    localStorage;
} catch (error) {
    require('localstorage-polyfill');
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export function get(key: string, options?: { session?: boolean, temp?: boolean }): any {
    let storageObj;

    if (isTemporary(options)) {
        storageObj = sessionStorage.getItem(key);
    } else {
        storageObj = localStorage.getItem(key);
    }

    if (storageObj) {
        if (UtilityService.isJson(storageObj)) {
            storageObj = JSON.parse(storageObj);
        }

        return (Object.keys(storageObj).includes('value')) ? storageObj.value : storageObj;
    } else {
        return null;
    }
}



/**
 *
 * @param {String} key
 * @param {*} value
 * @param {Object} [options]
 * @param {Boolean} [options.session]
 * @param {Boolean} [options.temp]
 * @returns {null|*|string}
 */
export function save(key: string, value: any, options?: { session?: boolean, temp?: boolean }): any {
    const storageObj = {
        value: value,
        expiration: null,
        saved: new Date()
    };

    const storageString = JSON.stringify(storageObj);

    if (isTemporary(options)) {
        sessionStorage.setItem(key, storageString);
    } else {
        localStorage.setItem(key, storageString);
    }

    return get(key, options);
}



export function remove(key: string, options?: { session?: boolean, temp?: boolean }): void {
    options = (TypeService.isObject(options)) ? options : {};

    if (isTemporary(options)) {
        sessionStorage.removeItem(key);
    } else {
        localStorage.removeItem(key);
    }
}



export function clear(): void {
    localStorage.clear();
    sessionStorage.clear();
}


function isTemporary(options?: { session?: boolean, temp?: boolean }): boolean {
    return options && (options.session === true || options.temp === true);
}


export default {
    get,
    save,
    remove,
    clear
};