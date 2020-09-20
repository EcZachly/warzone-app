let exportObj = {};


//===---==--=-=--==---===----===---==--=-=--==---===----//



/**
 * @description this ensures that an item is undefined
 *
 * @param {*} item - item to be tested
 * @returns {Boolean} - true or false
 */
export function isUndefined(item) {
	return typeof item === 'undefined';
}
exportObj.isUndefined = isUndefined;


/**
 * @description this ensures that an item is null
 *
 * @param {*} item - item to be tested
 * @returns {Boolean} - true or false
 */
export function isNull(item) {
	return item === null;
}
exportObj.isNull = isNull;


/**
 *@description this ensures an item is a date, or a valid date string
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [allowString=false] - allow a user to test if an item is a string and a valid date object
 * @returns {Boolean} - true or false
 */
export function isDate(item, allowString) {
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
exportObj.isDate = isDate;



/**
 * @description this ensures that an item is explicitly true or false
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [allowString=false] - allow 'true' and 'false' to return true
 * @param {*=} [equalityVal=null] - (true/false) if equalityVal is present, it will check to see if the value is true or false
 * @returns {Boolean} - true or false
 */
export function isBoolean(item, allowString, equalityVal) {
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
exportObj.isBoolean = isBoolean;



/**
 * @description this ensures that an item is an integer (a number without decimals)
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [withoutTypeConversion=false] - require that the item is not a string
 * @returns {Boolean} - true or false
 */
export function isInteger(item, withoutTypeConversion) {
	const itemIsInteger = (!isUndefined(item) && !isNull(item) && !isNaN(item) && (parseInt(Number(item)) == item) && !isNaN(parseInt(item, 10))); // eslint-disable-line
	const isNotString = (withoutTypeConversion === true) ? (itemIsInteger === true && !isString(item)) : true;
	return (itemIsInteger === true && isNotString === true);
}
exportObj.isInteger = isInteger;



/**
 * @description this ensures than an item is a number (with or without decimals)
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [withoutTypeConversion=false] - require that the item is not a string
 * @returns {Boolean} - true or false
 */
export function isNumeric(item, withoutTypeConversion) {
	const itemIsNumeric = (!isUndefined(item) && !isNull(item) && !isNaN(parseFloat(item)) && isFinite(item));
	const isNotString = (withoutTypeConversion === true) ? (itemIsNumeric === true && !isString(item)) : true;
	return (itemIsNumeric === true && isNotString === true);
}
exportObj.isNumeric = isNumeric;



/**
 * @description this ensures that an item is a function
 *
 * @param {*} item - item to be tested
 * @returns {Boolean} - true or false
 */
export function isFunction(item) {
	return (!isUndefined(item) && !isNull(item) && typeof item === 'function');
}
exportObj.isFunction = isFunction;



/**
 * @description this ensures that an item is a string
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the string has a length of at least one
 * @returns {Boolean} - true or false
 */
export function isString(item, requireNotEmpty) {
	const itemIsString = (!isUndefined(item) && !isNull(item) && typeof item === 'string');
	const isNotEmpty = (requireNotEmpty === true) ? (itemIsString === true && item.length > 0) : true;
	return (itemIsString === true && isNotEmpty === true);
}
exportObj.isString = isString;



/**
 * @description this ensures than an item is an object
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the object has at least one key
 * @returns {Boolean} - true or false
 */
export function isObject(item, requireNotEmpty) {
	const itemIsObject = (!isUndefined(item) && !isNull(item) && !isDate(item) && typeof item === 'object' && !isFunction(item) && Array.isArray(item) === false);
	const isNotEmpty = (requireNotEmpty === true) ? (itemIsObject === true && Object.keys(item).length > 0) : true;
	return (itemIsObject === true && isNotEmpty === true);
}
exportObj.isObject = isObject;



/**
 * @description this ensures than an item is an array
 *
 * @param {*} item - item to be tested
 * @param {Boolean} [requireNotEmpty=false] - require that the array has a length of at least one
 * @returns {Boolean} - true or false
 */
export function isArray(item, requireNotEmpty) {
	const isArray = !isUndefined(item) && !isNull(item) && Array.isArray(item);
	const isNotEmpty = (requireNotEmpty === true) ? (isArray === true && item.length > 0) : true;
	return (isArray === true && isNotEmpty === true);
}
exportObj.isArray = isArray;



/**
 *
 * @param {*} item
 * @returns {boolean} - true or false
 */
export function isIsoString(item) {
	if (isString(item, true)) {
		const isCorrectLength = item.length === 25;
		const nonNumbersIsValid = item.split('').filter((character) => isNaN(character)).join('') === '--T::+:';

		return isCorrectLength && nonNumbersIsValid;
	} else {
		return false;
	}
}
exportObj.isIsoString = isIsoString;



export default exportObj;