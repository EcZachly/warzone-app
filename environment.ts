declare var process: {
    env: {
        WARZONE_DATABASE_URL: string,
        WARZONE_EMAIL: string,
        WARZONE_PASSWORD: string,
        WARZONE_RECAPTCHA_SITE_KEY: string,
        WARZONE_RECAPTCHA_SECRET_KEY: string,
        PORT: number
    }
}
export default process
