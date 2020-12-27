import React, {useState} from "react";
import {Input} from "../components/SmartComponents";
import {Box, Button, Card, CardBody, CardHeader, Container, Header} from "../components/SimpleComponents";
import {Navbar, Page} from "../components/AppComponents";
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {GetStaticProps} from "next";
import UserService from "../components/Users/UserService";


export default function ForgotPassword({recaptchaSiteKey}) {
    const recaptcha = React.createRef<GoogleReCaptchaProvider>();

    let [email, setEmail] = useState('');
    let [token, setToken] = useState('');
    let [emailSent, setEmailSent] = useState(false);
    async function sendResetEmail() {
        let sent = await UserService.sendForgotPassword(email);
        setEmailSent(true);
    }

    let content = null;
    if(!emailSent){
        content = (
            <GoogleReCaptchaProvider ref={recaptcha} reCaptchaKey={recaptchaSiteKey}>

                <GoogleReCaptcha onVerify={token => setToken(token)} action="submit"/>

                <Card style={{marginTop: '20px', marginBottom: '20px'}}>
                    <CardHeader>
                        <Header>Forgot Password?</Header>
                    </CardHeader>

                    <CardBody>
                        <Input type={'text'}
                               subtype={'email'}
                               value={email}
                               disabled={!token}
                               onChange={(value) => setEmail(value)}
                               label={'Email'}
                               required={true}
                               placeholder={'domino@warcom.wz'}/>
                    </CardBody>
                </Card>

                <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type={'blue'} onClick={sendResetEmail} disabled={!token}>
                        Send Email
                    </Button>
                </Box>
            </GoogleReCaptchaProvider>
        )
    }
    else{
        content = <p>An email has been sent to {email}!</p>
    }


    return <Page title={'Warzone'} redirectIfLoggedIn={true}>
        <Navbar/>


        <Container size={'sm'} style={{maxWidth: '600px', paddingBottom: '100px'}}>

            {content}


        </Container>

    </Page>

}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    };
};