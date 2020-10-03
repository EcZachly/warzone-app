// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
const withSass = require('@zeit/next-sass');
module.exports = withSass((phase) => {
    const env = {
        WARZONE_DATABASE_URL: process.env.WARZONE_DATABASE_URL,
        WARZONE_EMAIL: process.env.WARZONE_EMAIL,
        WARZONE_PASSWORD: process.env.WARZONE_PASSWORD,
        WARZONE_RECAPTCHA_SITE_KEY: process.env.WARZONE_RECAPTCHA_SITE_KEY,
        WARZONE_RECAPTCHA_SECRET_KEY: process.env.WARZONE_RECAPTCHA_SECRET_KEY,
        HOSTNAME:  process.env.HOSTNAME || 'http://localhost:3000',
        PORT: process.env.PORT || 3000
    }
    const api = {
        bodyParser: {
            sizeLimit: '500kb',
        }
    }
    return {
        env,
        api
    }
});