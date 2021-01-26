export function isUndefined(item: any): boolean {
    return typeof item === 'undefined';
}


/**
 * @description this ensures that an item is null
 *
 * @param {*} item - item to be tested
 * @returns {Boolean} - true or false
 */
export function isNull(item: any): boolean {
    return item === null;
}


/**
 *@description this ensures an item is a date, or a valid date string
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [allowString=false] - allow a user to test if an item is a string and a valid date object
 * @returns {Boolean} - true or false
 */
export function isDate(item: any, allowString: boolean=false): boolean {
    const isNotInvalidType = (!isUndefined(item) && !isNull(item) && !isNumeric(item) && !isBoolean(item) && !isArray(item));
    const stringAllowance = (allowString !== true) ? !isString(item) : true;

    if (isNotInvalidType && stringAllowance) {
        if (allowString === true) {
            item = new Date(item);
        }

        return ((item instanceof Date === true) && (item.toString() !== 'Invalid Date'));

    } else {
        return false;
    }
}


/**
 * @description this ensures that an item is explicitly true or false
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [allowString=false] - allow 'true' and 'false' to return true
 * @param {*=} [equalityVal=null] - (true/false) if equalityVal is present, it will check to see if the value is true or false
 * @returns {Boolean} - true or false
 */
export function isBoolean(item: any, allowString: boolean=false, equalityVal=null): boolean {
    const itemIsBoolean = (item === true || item === false);
    const itemIsStringBoolean = (item === 'true' || item === 'false');

    if (equalityVal && equalityVal === 'true' || equalityVal === true || equalityVal === 'false' || equalityVal === false) {
        const bothAreTrue = ((item === true || item === 'true') && (equalityVal === true || equalityVal === 'true'));
        const bothAreFalse = ((item === false || item === 'false') && (equalityVal === false || equalityVal === 'false'));
        const equalityValCheck = (bothAreFalse || bothAreTrue);

        return ((allowString === true) ? (itemIsBoolean || itemIsStringBoolean) : itemIsBoolean) && equalityValCheck;
    } else {
        return (allowString === true) ? (itemIsBoolean || itemIsStringBoolean) : itemIsBoolean;
    }
}


/**
 * @description this ensures that an item is an integer (a number without decimals)
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [withoutTypeConversion=false] - require that the item is not a string
 * @returns {Boolean} - true or false
 */
export function isInteger(item: any, withoutTypeConversion: boolean=false): boolean {
    const itemIsInteger = (!isUndefined(item) && !isNull(item) && !isNaN(item) && (parseInt(item) == item) && !isNaN(parseInt(item, 10))); // eslint-disable-line
    const isNotString = (withoutTypeConversion === true) ? (itemIsInteger === true && !isString(item)) : true;
    return (itemIsInteger === true && isNotString === true);
}

/**
 * @description this ensures than an item is a number (with or without decimals)
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [withoutTypeConversion=false] - require that the item is not a string
 * @returns {Boolean} - true or false
 */
export function isNumeric(item: any, withoutTypeConversion: boolean=false): boolean {
    const itemIsNumeric = (!isUndefined(item) && !isNull(item) && !isNaN(parseFloat(item)) && isFinite(item));
    const isNotString = (withoutTypeConversion === true) ? (itemIsNumeric === true && !isString(item)) : true;
    return (itemIsNumeric === true && isNotString === true);
}


/**
 * @description this ensures that an item is a function
 *
 * @param {*} item - item to be tested
 * @returns {Boolean} - true or false
 */
export function isFunction(item: any): boolean {
    return (!isUndefined(item) && !isNull(item) && typeof item === 'function');
}


/**
 * @description this ensures that an item is a string
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the string has a length of at least one
 * @returns {Boolean} - true or false
 */
export function isString(item: any, requireNotEmpty: boolean=false): boolean {
    const itemIsString = (!isUndefined(item) && !isNull(item) && typeof item === 'string');
    const isNotEmpty = (requireNotEmpty === true) ? (itemIsString === true && item.length > 0) : true;
    return (itemIsString === true && isNotEmpty === true);
}

/**
 * @description this ensures than an item is an object
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the object has at least one key
 * @returns {Boolean} - true or false
 */
export function isObject(item: any, requireNotEmpty: boolean=false): boolean {
    const itemIsObject = (!isUndefined(item) && !isNull(item) && !isDate(item) && typeof item === 'object' && !isFunction(item) && Array.isArray(item) === false);
    const isNotEmpty = (requireNotEmpty === true) ? (itemIsObject === true && Object.keys(item).length > 0) : true;
    return (itemIsObject === true && isNotEmpty === true);
}


/**
 * @description this ensures than an item is an array
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the array has a length of at least one
 * @returns {Boolean} - true or false
 */
export function isArray(item: any, requireNotEmpty: boolean=false): boolean {
    const isArray = !isUndefined(item) && !isNull(item) && Array.isArray(item);
    const isNotEmpty = (requireNotEmpty === true) ? (isArray === true && item.length > 0) : true;
    return (isArray === true && isNotEmpty === true);
}


/**
 *
 * @param {*} item
 * @returns {boolean} - true or false
 */
export function isIsoString(item: any): boolean {
    if (isString(item, true)) {
        const isCorrectLength = item.length === 25;
        const nonNumbersIsValid = item.split('').filter((character) => isNaN(character)).join('') === '--T::+:';

        return isCorrectLength && nonNumbersIsValid;
    } else {
        return false;
    }
}


export default {
    isToIsoString: isIsoString,
    isArray: isArray,
    isObject: isObject,
    isString: isString,
    isFunction: isFunction,
    isInteger: isInteger,
    isBoolean: isBoolean,
    isUndefined: isUndefined,
    isNull: isNull,
    isDate: isDate,
    isNumeric: isNumeric
};