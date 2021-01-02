import React, {useState} from 'react';
import {GetStaticProps} from 'next';
import {GoogleReCaptcha, GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

import {Input} from '../components/SmartComponents';
import {
    Box,
    Paragraph,
    Button,
    Alert,
    CardFooter,
    Text,
    Card,
    CardBody,
    CardHeader,
    Container,
    Header
} from '../components/SimpleComponents';
import {Navbar, Page} from '../components/AppComponents';
import UserService from '../components/Users/UserService';
import {BASE_TITLE} from '../../lib/constants';
import {DEFAULT_ERROR_MESSAGE} from '../config/CONSTANTS';
import _ from 'lodash';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export default function ForgotPassword(props) {
    const recaptcha = React.createRef<GoogleReCaptchaProvider>();

    let [email, setEmail] = useState('');
    let [token, setToken] = useState('');
    let [formIsDisabled, setFormIsDisabled] = useState(true);
    let [errorMessage, setErrorMessage] = useState(null);
    let [emailSent, setEmailSent] = useState(false);

    async function sendResetEmail() {
        setFormIsDisabled(true);
        setErrorMessage(null);

        try {
            let response = await UserService.sendForgotPassword(email);
            console.log(response);
            setEmailSent(true);
        } catch (error) {
            console.error(error);
            setErrorMessage((_.get(error, 'data.userMessage')) ? error.data.userMessage : DEFAULT_ERROR_MESSAGE);
            setFormIsDisabled(false);
        }
    }

    let content = null;

    if (!emailSent) {
        content = (
            <GoogleReCaptchaProvider ref={recaptcha} reCaptchaKey={process.env.NEXT_PUBLIC_WARZONE_RECAPTCHA_SITE_KEY}>

                <GoogleReCaptcha onVerify={token => {
                    setToken(token);
                    setFormIsDisabled(false);
                }} action="submit"/>

                <Card>
                    <CardHeader>
                        <Header>Forgot Password?</Header>

                        <Alert hideIfEmpty={true} type={'error'}>
                            {errorMessage}
                        </Alert>
                    </CardHeader>

                    <CardBody>
                        <Input type={'text'}
                               subtype={'email'}
                               value={email}
                               disabled={!token || formIsDisabled}
                               onChange={(value) => setEmail(value)}
                               helpMessage={'Enter your email and we\'ll send you a link where you can create a new password'}
                               label={'Email'}
                               onEnter={sendResetEmail}
                               required={true}
                               placeholder={'domino@warcom.wz'}/>
                    </CardBody>

                    <CardFooter>
                        <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button type={'blue'} onClick={sendResetEmail} disabled={!token || formIsDisabled}>
                                Send Email
                            </Button>
                        </Box>
                    </CardFooter>
                </Card>

            </GoogleReCaptchaProvider>
        );
    } else {
        content = (
            <Card>
                <CardHeader>
                    <Header>Success!</Header>
                </CardHeader>

                <CardBody>
                    <Paragraph>
                        To reset your password, please follow the instructions in the email sent to <Text bold italic>{email}</Text>.
                    </Paragraph>

                    <Paragraph type={'help'}>
                        If your email doesn't arrive to your inbox, or junk folder, within a few minutes, please try again.
                    </Paragraph>
                </CardBody>
            </Card>
        );
    }


    return (
        <Page title={`${BASE_TITLE}: Forgot Password`} redirectIfLoggedIn={true}>
            <Navbar/>

            <Container size={'sm'}
                       style={{maxWidth: '600px', paddingBottom: '100px', paddingTop: '20px'}}>
                {content}
            </Container>
        </Page>
    );

}
