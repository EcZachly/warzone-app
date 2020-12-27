import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
import {SENDER_EMAIL} from "../../constants";


type Email = {
    subject: string,
    text: string,
    html: string
}

const EMAIL_MAP = {
    'confirm_account': (data) => {
        return {
            subject: 'Confirm your email for Warzone Stats Tracker',
            text: 'click the link in the html to confirm your Warzone Account',
            html: `<html>
                    <head>
                      <title>Confirm your email for Warzone Stats Tracker</title>
                    </head>
                    <body>   
                      <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                           Click on this link to <a href="${"https://www.brshooter.com/api/user/confirm?confirm_string=" + data.confirm_string}">confirm your account</a>
                        <p style="font-size:12px; line-height:20px;">
                          <a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="font-family:sans-serif;text-decoration:none;">
                            Unsubscribe
                          </a>
                          -
                          <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="font-family:sans-serif;text-decoration:none;">
                            Unsubscribe Preferences
                          </a>
                        </p>
                      </div>
                    </body>
                  </html>
                `
        } as Email
    },
    'forgot_password': (data) => {
        return {
            subject: 'Forgot password for Warzone Stats Tracker',
            text: 'click the link to reset your Warzone Stats Tracker password',
            html: `<p>click the link to reset your Warzone Stats Tracker password: ${data.link}</p>`
        } as Email
    }
};


export function sendEmail(emailType, data) {
    let emailObject = EMAIL_MAP[emailType](data);
    const msg = {
        to: data.email,
        from: SENDER_EMAIL,
        ...emailObject
    }
    return sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            return true;
        })
        .catch((error) => {
            console.error(error)
            return false;
        });
}

export default {
    sendEmail
}

