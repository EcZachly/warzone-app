import React, {useState, useEffect, Component} from 'react';
import {useRouter} from 'next/router';

import {Navbar, Page, Footer, GamerCard} from './../components/AppComponents';
import {
    Container,
    Header,
    CardBody,
    Card,
    Alert,
    CardFooter,
    Button,
    Paragraph,
    Form,
    CardHeader,
    Box,
    Text,
    Small,
    Main,
    LineBreak, UnorderedList, ListItem
} from './../components/SimpleComponents';
import {Input} from './../components/SmartComponents';

import CONSTANTS from './../config/CONSTANTS';

import {UserService} from './../components/Users';
import UtilityService, {getBaseUrlWithProtocol} from '../services/UtilityService';
import TypeService from '../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let SignUpPage = ({baseUrl}) => {
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
        first_name: {
            defaultValue: '',
            validate: (value) => {
                return (TypeService.isString(value, true)) ? false : 'First Name is required';
            },
            sanitize: (value) => {
                return sanitizeBasicInput(value);
            }
        },
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
                } else if (value.length < 8) {
                    return 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters long';
                } else if (value.length > MAX_LENGTH) {
                    return 'Password cannot be more than ' + MAX_LENGTH + ' characters long';
                } else {
                    return false;
                }
            },
            sanitize: (value) => {
                return sanitizeBasicInput(value);
            }
        }
    };

    let [inputs, updateInputs] = useState({
        first_name: '',
        email: '',
        validate_email: '',
        password: '',
        validate_password: ''
    });

    let [errors, updateErrors] = useState({
        first_name: '',
        email: '',
        validate_email: '',
        password: '',
        validate_password: ''
    });

    let [isDisabled, setDisabled] = useState(false);
    let [formMessage, setFormErrorMessage] = useState({
        type: 'error',
        message: ''
    });
    let router = useRouter();

    return (
        <Page title={'Sign Up'}>
            <Navbar/>

            <Main>
                <Container size={'sm'}>
                    <Card style={{marginTop: '20px', marginBottom: '100px'}}>
                        <CardHeader>
                            <Header>Sign Up</Header>

                            <Paragraph type={'help'}>
                                Signing up for an account will give you insight to your gameplay, friend tracking, and
                                personalized recommendations to improve your Warzone performance. <Text bold>
                                You will be able to add and manage your Warzone accounts when you log in.
                            </Text>
                            </Paragraph>

                            <Paragraph>
                                If you already have an account, <a href={'/login'}>log in here</a>
                            </Paragraph>

                            <Alert hideIfEmpty={true} type={formMessage.type}>
                                {formMessage.message}
                            </Alert>
                        </CardHeader>

                        <CardBody>
                            <Input type={'text'}
                                   value={inputs.first_name}
                                   errorMessage={errors.first_name}
                                   onChange={(value) => updateFormInput('first_name', value)}
                                   label={'First Name'}
                                   onEnter={signupButtonClick}
                                   focus={true}
                                   required={true}
                                   disabled={isDisabled}
                                   placeholder={'Domino'}/>



                            <LineBreak clear/>



                            <Input type={'text'}
                                   subtype={'email'}
                                   value={inputs.email}
                                   errorMessage={errors.email}
                                   onChange={(value) => updateFormInput('email', value)}
                                   label={'Email'}
                                   onEnter={signupButtonClick}
                                   required={true}
                                   disabled={isDisabled}
                                   placeholder={'domino@warcom.wz'}/>


                            <Input type={'text'}
                                   subtype={'email'}
                                   value={inputs.validate_email}
                                   errorMessage={errors.validate_email}
                                   onChange={(value) => updateFormInput('validate_email', value)}
                                   label={'Validate Email'}
                                   onEnter={signupButtonClick}
                                   required={true}
                                   disabled={isDisabled}
                                   placeholder={'domino@warcom.wz'}/>



                            <LineBreak clear/>



                            <Input type={'text'}
                                   subtype={'password'}
                                   value={inputs.password}
                                   errorMessage={errors.password}
                                   onChange={(value) => updateFormInput('password', value)}
                                   label={'Password'}
                                   onEnter={signupButtonClick}
                                   required={true}
                                   disabled={isDisabled}/>


                            <Input type={'text'}
                                   subtype={'password'}
                                   value={inputs.validate_password}
                                   errorMessage={errors.validate_password}
                                   onChange={(value) => updateFormInput('validate_password', value)}
                                   label={'Validate Password'}
                                   onEnter={signupButtonClick}
                                   required={true}
                                   disabled={isDisabled}/>

                            <UnorderedList>
                                <ListItem>
                                    Your password should be at least {MIN_PASSWORD_LENGTH} characters long
                                </ListItem>

                                <ListItem>
                                    Please use a completely <Text style={{color: CONSTANTS.COLORS.ORANGE}} italic
                                                                  bold>
                                    unique password
                                </Text> that isn't used anywhere else.
                                </ListItem>

                                <ListItem>
                                    We highly recommend that you use a password manager to generate and store a
                                    completely random password.
                                </ListItem>
                            </UnorderedList>

                        </CardBody>



                        <CardFooter>
                            <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button type={'blue'} onClick={signupButtonClick}>
                                    Sign Up
                                </Button>
                            </Box>
                        </CardFooter>
                    </Card>

                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    function updateFormInput(key, value) {
        inputs[key] = value;
        updateInputs({...inputs});
    }



    function signupButtonClick() {
        setDisabled(true);
        setFormErrors();
        setFormErrorMessage({type: 'error', message: ''});

        if (formIsValid()) {
            let signupDetails = getDatabaseObject();

            UserService.createUser(signupDetails).then((newUser) => {
                setFormErrorMessage({
                    type: 'success',
                    message: 'Your account was successfully created. Redirecting you to the login page'
                });

                setTimeout(() => {
                    router.replace({
                        pathname: '/login'
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



    function getDatabaseObject() {
        return Object.keys(inputs).reduce((dbObj, key, index) => {
            if (FORM_INPUT_CONFIG[key]) {
                dbObj[key] = FORM_INPUT_CONFIG[key].sanitize(inputs[key]);
            }

            return dbObj;
        }, {});
    }


    function formIsValid() {
        return Object.keys(getInputErrors()).length === 0;
    }



    function setFormErrors() {
        updateErrors({...getInputErrors()});
    }



    function getInputErrors() {
        let inputKeys = Object.keys(inputs);
        let errorMessages = {} as any;

        inputKeys.forEach((key) => {
            let value = inputs[key];

            if (FORM_INPUT_CONFIG[key]) {
                let errorMessage = FORM_INPUT_CONFIG[key].validate(value);

                if (errorMessage) {
                    errorMessages[key] = errorMessage;
                }
            }
        });

        if (Object.keys(errorMessages).length <= 0) {
            if (inputs.email !== inputs.validate_email) {
                errorMessages.validate_email = 'Emails do not match';
            }

            if (inputs.password !== inputs.validate_password) {
                errorMessages.validate_password = 'Passwords do not match';
            }
        }

        return errorMessages;
    }
};


export default SignUpPage;