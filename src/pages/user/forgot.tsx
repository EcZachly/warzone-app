import {GetServerSideProps} from 'next';
import {getBaseUrlWithProtocol} from '../../services/UtilityService';
import {Navbar, Page} from '../../components/AppComponents';
import React, {useState} from 'react';
import {Input} from '../../components/SmartComponents';
import {Alert, Box, Button, CardHeader, Container} from '../../components/SimpleComponents';
import HttpService from '../../services/HttpService';
import UserService from '../../components/Users/UserService';
import { useRouter } from 'next/router';
import {BASE_TITLE} from '../../../lib/constants';

export default function confirmUserAccount({user, error}) {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formMessage, setFormMessage] = useState({type: 'error', message: ''});

    //TODO ADD FORGOT PASSWORD update push
    async function sendResetRequest(){
        if(password === confirmPassword && password.length >= 8){
            const copyUser = JSON.parse(JSON.stringify(user));
            copyUser.password = password;
            const updated =  await UserService.finishForgotPassword(copyUser);
            router.push('/login');
        }
        else{
            if(password !== confirmPassword){
                setFormMessage({type: 'error', message: 'passwords do not match'});
            }
            else if(password.length < 8){
                setFormMessage({type: 'error', message: 'password needs to be at least 8 characters'});
            }
        }
    }

    let content = (
        <div>

            <Input type={'text'}
                   subtype={'password'}
                   value={password}
                   onChange={(value) => setPassword(value)}
                   label={'New password'}
                   required={true}
                   disabled={!user}
                   placeholder={'domino@warcom.wz'}/>


            <Input type={'text'}
                   subtype={'password'}
                   value={confirmPassword}
                   onChange={(value) =>setConfirmPassword(value)}
                   label={'Confirm new password'}
                   required={true}
                   disabled={!user}
                   placeholder={'domino@warcom.wz'}/>


            <Alert hideIfEmpty={true} type={formMessage.type}>
                {formMessage.message}
            </Alert>

            <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button type={'blue'} onClick={sendResetRequest}>
                    Reset Password
                </Button>
            </Box>

        </div>
    );

    if(error){
        content = <h1>Invalid page!</h1>;
    }
    return <Page title={`${BASE_TITLE}: Confirm Forgot Password`} redirectIfLoggedIn={true}>
        <Navbar/>


        <Container size={'sm'} style={{maxWidth: '600px', paddingBottom: '100px'}}>

            {content}


        </Container>

    </Page>;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {forgot_string} = context.query;
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const userConfirmed = await fetch(`${baseUrl}/api/users?forgot_string=${forgot_string}`);

    const allData = (await userConfirmed.json()) as Record<any, unknown>[];

    if (allData.length) {
        return {
            props: {
                user: allData[0],
                error: null
            }
        };
    }
    else{
        return {
            props: {
                user: {},
                error: {message: 'invalid page'}
            }
        };
    }
};
