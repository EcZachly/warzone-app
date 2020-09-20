let exportObj = {};

import TypeService from './TypeService.js';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
exportObj.sleep = sleep;




/**
 *
 * @param {*} item
 * @param {'undefined' | 'null' | 'object' | 'date' | 'boolean' | 'integer' | 'number' | 'function' | 'string' | 'array'} type
 * @param {*} [defaultValue]
 *
 * @returns {*}
 */
export function validateItem(item, type, defaultValue) {
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
		throw new Error('invalid key');
	}
}
exportObj.validateItem = validateItem;



export default exportObj;