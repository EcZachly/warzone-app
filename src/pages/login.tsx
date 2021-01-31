import React, {useState} from 'react';
import {useRouter} from 'next/router';

import {Footer, Navbar, Page} from './../components/AppComponents';
import {
    Alert,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Container,
    Header,
    Main,
    Paragraph
} from './../components/SimpleComponents';
import {Input} from './../components/SmartComponents';

import CONSTANTS from './../config/CONSTANTS';

import {UserService} from './../components/Users';
import UtilityService from '../services/UtilityService';
import TypeService from '../services/TypeService';
import PageLink from '../components/simple-components/Link';
import {BASE_TITLE} from '../../lib/constants';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const LoginPage = ({baseUrl}) => {
    const MAX_LENGTH = 130;
    const MIN_PASSWORD_LENGTH = 8;

    function sanitizeBasicInput(value) {
        value = UtilityService.validateItem(value, 'string', '').trim();

        if (value.length > MAX_LENGTH) {
            value.length = MAX_LENGTH;
        }

        return value;
    }

    const FORM_INPUT_CONFIG = {
        email: {
            defaultValue: '',
            validate: (value) => {
                if (TypeService.isString(value, true) === false) {
                    return 'Email is required';
                } else if (UtilityService.isValidEmail(value) === false) {
                    return 'Email is invalid';
                } else {
                    return false;
                }
            },
            sanitize: (value) => {
                return sanitizeBasicInput(value);
            }
        },
        password: {
            defaultValue: '',
            validate: (value) => {
                if (TypeService.isString(value, true) === false) {
                    return 'Password is required';
                } else {
                    return false;
                }
            },
            sanitize: (value) => {
                return sanitizeBasicInput(value);
            }
        }
    };

    const [inputs, updateInputs] = useState({
        email: '',
        password: ''
    });

    const [errors, updateErrors] = useState({
        email: '',
        password: ''
    });

    const [isDisabled, setDisabled] = useState(false);
    const [formMessage, setFormErrorMessage] = useState({
        type: 'error',
        message: ''
    });
    const router = useRouter();

    return (
        <Page title={`${BASE_TITLE}: Login`}>
            <Navbar/>

            <Main>
                <Container size={'sm'} style={{maxWidth: '600px',  paddingBottom: '100px'}}>
                    <Card style={{marginTop: '20px', marginBottom: '20px'}}>
                        <CardHeader>
                            <Header>Log In</Header>

                            <Alert hideIfEmpty={true} type={formMessage.type}>
                                {formMessage.message}
                            </Alert>
                        </CardHeader>

                        <CardBody>


                            <Input type={'text'}
                                   subtype={'email'}
                                   value={inputs.email}
                                   errorMessage={errors.email}
                                   onChange={(value) => updateFormInput('email', value)}
                                   label={'Email'}
                                   onEnter={loginButtonClick}
                                   required={true}
                                   disabled={isDisabled}
                                   placeholder={'domino@warcom.wz'}/>



                            <Input type={'text'}
                                   subtype={'password'}
                                   value={inputs.password}
                                   errorMessage={errors.password}
                                   onChange={(value) => updateFormInput('password', value)}
                                   label={'Password'}
                                   onEnter={loginButtonClick}
                                   required={true}
                                   disabled={isDisabled}/>


                        </CardBody>



                        <CardFooter>
                            <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button type={'blue'} onClick={loginButtonClick}>
                                    Log In
                                </Button>
                            </Box>

                            <a href={'/forgot'}>Forgot your password?</a>
                        </CardFooter>
                    </Card>

                    <Paragraph>
                        If you don't have an account, you can <a href={'/signup'}>sign up here for free</a>
                    </Paragraph>

                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    function updateFormInput(key, value) {
        inputs[key] = value;
        updateInputs({...inputs});
    }



    function loginButtonClick() {
        setDisabled(true);
        setFormErrors();
        setFormErrorMessage({type: 'error', message: ''});

        if (formIsValid()) {
            const loginDetails = getDatabaseObject();

            UserService.login(loginDetails).then((user) => {
                setFormErrorMessage({
                    type: 'success',
                    message: 'You\'ve successfully logged in, redirecting...'
                });

                setTimeout(() => {
                    router.replace({
                        pathname: '/dashboard'
                    });
                }, 2500);
            }).catch((error) => {
                console.error(error);
                let errorMessage = CONSTANTS.DEFAULT_ERROR_MESSAGE + '. Please try again later.';

                if (error && error.data && error.data.userMessage) {
                    errorMessage = error.data.userMessage;
                }

                setFormErrorMessage({
                    type: 'error',
                    message: errorMessage
                });
                setDisabled(false);
            });
        } else {
            setDisabled(false);
        }
    }



    function getDatabaseObject(): { email: string, password: string } {
        return Object.keys(inputs).reduce((dbObj, key, index) => {
            if (FORM_INPUT_CONFIG[key]) {
                dbObj[key] = FORM_INPUT_CONFIG[key].sanitize(inputs[key]);
            }

            return dbObj;
        }, {email: null, password: null});
    }


    function formIsValid() {
        return Object.keys(getInputErrors()).length === 0;
    }



    function setFormErrors() {
        updateErrors({...getInputErrors()});
    }



    function getInputErrors() {
        const inputKeys = Object.keys(inputs);
        const errorMessages = {} as any;

        inputKeys.forEach((key) => {
            const value = inputs[key];

            if (FORM_INPUT_CONFIG[key]) {
                const errorMessage = FORM_INPUT_CONFIG[key].validate(value);

                if (errorMessage) {
                    errorMessages[key] = errorMessage;
                }
            }
        });

        return errorMessages;
    }
};


export default LoginPage;