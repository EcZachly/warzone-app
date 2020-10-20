export async function handleRecaptchaVerify(token) {
    const secret_key = process.env.WARZONE_RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    return await fetch(url, {
        method: 'POST'
    }).then(response => response.json());
}



export default {
    handleRecaptchaVerify
};