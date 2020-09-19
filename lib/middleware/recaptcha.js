import {RecaptchaV3} from 'express-recaptcha'
let recaptcha = new RecaptchaV3(process.env.WARZONE_RECAPTCHA_SITE_KEY, process.env.WARZONE_RECAPTCHA_SECRET_KEY);

export default recaptcha;
