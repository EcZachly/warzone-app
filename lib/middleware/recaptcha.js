import {RecaptchaV3} from 'express-recaptcha'

console.log(process.env.WARZONE_RECAPTCHA_SITE_KEY, process.env.WARZONE_RECAPTCHA_SECRET_KEY)
let recaptcha = new RecaptchaV3(process.env.WARZONE_RECAPTCHA_SITE_KEY, process.env.WARZONE_RECAPTCHA_SECRET_KEY, {callback:'captchaCallback'});

export default recaptcha;
