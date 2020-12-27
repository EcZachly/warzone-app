import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.WARZONE_SENDGRID_API_KEY);
import {SENDER_EMAIL} from '../../constants';



type EmailAddress = string;

type EmailID = string;

type EmailMap = Record<EmailID, EmailGenerator>

type EmailTemplateData = {
    email: string,
    [x: string]: any
}

type EmailGenerator = (EmailTemplateData: EmailTemplateData) => GeneratedEmailConfig;

type GeneratedEmailConfig = {
    subject: string,
    text: string,
    html: string
};

type SendGridMessage = GeneratedEmailConfig & {
    to: EmailAddress,
    from: EmailAddress,
    [x: string]: any
}

const EMAIL_MAP: EmailMap = {
    'confirm_account': (data): GeneratedEmailConfig => {
        return {
            subject: 'Confirm your email for Warzone Stats Tracker',
            text: 'click the link in the html to confirm your Warzone Account',
            html: (`
                    <html>
                    <head>
                      <title>Confirm your email for Warzone Stats Tracker</title>
                    </head>
                    <body>   
                      <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                           Click on this link to <a href="${'https://www.brshooter.com/api/user/confirm?confirm_string=' + data.metadata.confirm_string}">confirm your account</a>
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
            `)
        };
    },
    'forgot_password': (data): GeneratedEmailConfig => {
        let forgotUrl = 'https://www.brshooter.com/user/forgot?forgot_string=' + data.forgot_string;

        return {
            subject: 'Forgot password for Warzone Stats Tracker',
            text: 'click the link to reset your Warzone Stats Tracker password',
            html: `<p>click the link to reset your Warzone Stats Tracker password: ${forgotUrl}</p>`
        };
    }
};



function getEmailTemplateByID(email_id: EmailID): EmailGenerator {
    return EMAIL_MAP[email_id];
}



function isValidEmailID(email_id: EmailID): Boolean {
    return !!getEmailTemplateByID(email_id);
}



function generateSendGridMessage(email_id: EmailID, templateData: EmailTemplateData): SendGridMessage {
    let emailTemplateObject = getEmailTemplateByID(email_id);
    let templatedEmailConfig = emailTemplateObject(templateData);

    return {
        to: templateData.email,
        from: SENDER_EMAIL,
        ...templatedEmailConfig
    };
}



export function sendEmail(email_id: string, templateData: EmailTemplateData) {
    return new Promise((resolve, reject) => {
        if (!isValidEmailID(email_id)) {
            reject(new Error('email_id (String) is required and must be a valid ID'));
        } else {
            sgMail.send(generateSendGridMessage(email_id, templateData)).then(() => {
                console.log('Email sent');
                resolve(true);
            }).catch((error) => {
                console.error(error);
                resolve(false);
            });
        }
    });
}

export default {
    sendEmail
};

