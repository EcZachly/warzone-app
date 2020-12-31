import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.WARZONE_SENDGRID_API_KEY);
import {SENDER_EMAIL} from '../../constants';
import FileService from '../Files/FileService';

type EmailAddress = string;

type EmailID = string;

type EmailMap = Record<EmailID, EmailGenerator>

type EmailTemplateData = {
    email: string,
    [x: string]: any
}

type EmailGenerator = (EmailTemplateData: EmailTemplateData) => Promise<GeneratedEmailConfig>;

type GeneratedEmailConfig = {
    subject: string,
    text: string,
    path: string,
    html: string
};

type SendGridMessage = GeneratedEmailConfig & {
    to: EmailAddress,
    from: EmailAddress,
    [x: string]: any
}

const baseUrl = 'https://www.brshooter.com';



export function sendEmail(email_id: string, templateData: EmailTemplateData): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        if (!isValidEmailID(email_id)) {
            reject(new Error('email_id (String) is required and must be a valid ID'));
        } else {
            let sendGridMessage = await _generateSendGridMessage(email_id, templateData);

            sgMail.send(sendGridMessage).then(() => {
                resolve(true);
            }).catch((error) => {
                console.error(error);
                resolve(false);
            });
        }
    });
}



const EMAIL_MAP: EmailMap = {
    'confirm_account': async (data) => {
        return new Promise(async (resolve, reject) => {
            data.confirm_user_url = 'https://www.brshooter.com/api/confirm-user?confirm_string=' + data.confirm_string;

            let config = {
                subject: 'Confirm your email for Warzone Stats Tracker',
                text: 'click the link in the html to confirm your Warzone Account',
                path: __dirname + '/Emails/confirm_account/index.html',
                html: ''
            };

            let actualHtml = await FileService.readFile(config.path);
            config.html = substituteTemplateData(actualHtml, data);

            resolve(config);
        });
    },
    'forgot_password': async (data) => {
        return new Promise(async (resolve, reject) => {
            data.forgotUrl = baseUrl + '/user/forgot?forgot_string=' + data.forgot_string;

            let config = {
                subject: 'Forgot password for Warzone Stats Tracker',
                text: 'click the link to reset your Warzone Stats Tracker password',
                path: __dirname + '/Emails/forgot_password/index.html',
                html: ''
            };

            let actualHtml = await FileService.readFile(config.path);
            config.html = substituteTemplateData(actualHtml, data);

            resolve(config);
        });
    }
};



function substituteTemplateData(text: string, data: Record<any, string>): string {
    let substitutionKeys = Object.keys(data);

    substitutionKeys.forEach((key) => {
        let substitutionString = '{{' + key + '}}';
        text = text.replace(new RegExp(substitutionString, 'g'), data[key]);
    });

    return text;
}



function getEmailTemplateByID(email_id: EmailID): EmailGenerator {
    return EMAIL_MAP[email_id];
}



function isValidEmailID(email_id: EmailID): Boolean {
    return !!getEmailTemplateByID(email_id);
}



export async function _generateSendGridMessage(email_id: EmailID, templateData: EmailTemplateData): Promise<SendGridMessage> {
    return new Promise(async (resolve, reject) => {
        let emailTemplateObject = getEmailTemplateByID(email_id);
        let templatedEmailConfig = await emailTemplateObject(templateData);

        resolve({
            to: templateData.email,
            from: SENDER_EMAIL,
            ...templatedEmailConfig
        });
    });
}



export default {
    sendEmail,
    _generateSendGridMessage
};

