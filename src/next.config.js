import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const withSass = require('@zeit/next-sass');
import withSass from '@zeit/next-sass';

module.exports = withSass((nextConfig) => {
	return nextConfig;
});