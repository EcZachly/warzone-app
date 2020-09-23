// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration

module.exports =  (phase) => {
    const env = {
        WARZONE_DATABASE_URL: process.env.WARZONE_DATABASE_URL,
        WARZONE_EMAIL: process.env.WARZONE_EMAIL,
        WARZONE_PASSWORD: process.env.WARZONE_PASSWORD,
        WARZONE_RECAPTCHA_SITE_KEY: process.env.WARZONE_RECAPTCHA_SITE_KEY,
        WARZONE_RECAPTCHA_SECRET_KEY: process.env.WARZONE_RECAPTCHA_SECRET_KEY,
        PORT: process.env.PORT || 3000
    }
    return {
        env,
    }
}