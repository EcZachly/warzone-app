import {Alert, Box, Button, Header, Image} from '../SimpleComponents';
import {Input} from '../SmartComponents';
import React, {useState} from 'react';
import {GamerService} from './index';
import HttpService from '../../services/HttpService';
import Router from 'next/router';

import {GoogleReCaptcha, GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

//===---==--=-=--==---===----===---==--=-=--==---===----//



const CONFIG = {
    PLATFORM_OPTIONS: GamerService.getGamerPlatforms().map(({id, name}) => ({text: name, value: id}))
};

type GamerAddProps = {
    recaptchaSiteKey: string,
    baseUrl: string
}

export default function GamerAdd({recaptchaSiteKey, baseUrl}: GamerAddProps) {

    const recaptcha = React.createRef<GoogleReCaptchaProvider>();
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState('xbl');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});


    let loadingComponent = <div/>;

    if (loading) {
        //TODO make this a spinner
        loadingComponent = <Image style={{width: '50px', height: '50px'}} src={'/images/spinner_gif.gif'}/>;
    }

    const addGamer = async () => {
        const newUserConfig = {
            username: username,
            platform: platform
        };

        let errorMessage = '';

        //Reset the recaptcha token in case they make a mistake
        setToken(await recaptcha.current.executeRecaptcha('submit'));

        if (!newUserConfig.username) {
            errorMessage = 'Username is required';
        } else if (!newUserConfig.platform) {
            errorMessage = 'Platform is required';
        }

        if (!errorMessage) {
            setLoading(true);
            setMessage({message: '', type: ''});

            const response = await HttpService.http({
                url: baseUrl + '/api/gamer',
                method: 'POST',
                body: {
                    username: newUserConfig.username,
                    platform: newUserConfig.platform,
                    token: token
                }
            });

            if (response.status === 200) {
                Router.push(response.data.url || ['gamer', newUserConfig.platform, encodeURIComponent(newUserConfig.username)].join('/'));
            } else {
                let message: unknown = 'An unknown error occurred while trying to create the user';

                if (response.data && response.data.userMessage) {
                    message = response.data.userMessage;
                }

                setLoading(false);
                setMessage({message: message, type: 'error'});
            }
        } else {
            setMessage({message: errorMessage, type: 'error'});
        }
    };

    //The input is disabled if they've already submitted or they don't have a recaptcha token
    const disabled = loading || !token;

    return (
        <GoogleReCaptchaProvider ref={recaptcha} reCaptchaKey={recaptchaSiteKey}>

            <GoogleReCaptcha onVerify={token => setToken(token)} action="submit"/>

            <Box>
                <Header size={'sm'}>Add Gamer</Header>

                <Input label={'Username'}
                       type={'text'}
                       disabled={disabled}
                       value={username}
                       onChange={(username) => setUsername(username)}
                       placeholder={'Username'}/>

                <Input label={'Platform'}
                       type={'select'}
                       disabled={disabled}
                       options={CONFIG.PLATFORM_OPTIONS}
                       value={platform}
                       onChange={(value) => setPlatform(value)}/>

                {loadingComponent}

                <Alert type={message['type']}
                       hideIfEmpty>
                    {message['message']}
                </Alert>

                <Button onClick={() => addGamer()}>
                    Add Gamer
                </Button>
            </Box>

        </GoogleReCaptchaProvider>
    );
}