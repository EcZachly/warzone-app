module.exports = {
	env: {
		'browser': true,
		'es6': true,
		'node': true,
		'mocha': true
	},
	extends: 'plugin:@typescript-eslint/recommended',
	globals: {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	plugins: [
		'react',
		'mocha',
		'@typescript-eslint'
	],
	rules: {
		'no-async-promise-executor': [
			'off'
		],
		'no-unused-vars': [
			'off'
		],
		'@typescript-eslint/no-unused-vars': [
			'off'
		],
		'@typescript-eslint/no-empty-function': [
			'off'
		],
		'eqeqeq': [
			'error',
			'smart'
		],
		'require-atomic-updates': [
			'off'
		],
		'no-extra-semi': [
			'error'
		],
		'no-alert': [
			'error'
		],
		'no-eval': [
			'error'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'no-useless-escape': [
			'off'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};