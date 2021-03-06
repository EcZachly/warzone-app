import {Alert, Box, Button, Header, Image} from '../SimpleComponents';
import {Input} from '../SmartComponents';
import React, {useState} from 'react';
import {GamerService} from './index';
import HttpService from '../../services/HttpService';
import Router from 'next/router';

import {GoogleReCaptcha, GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//



const CONFIG = {
    PLATFORM_OPTIONS: GamerService.getGamerPlatforms().map(({id, name}) => ({text: name, value: id}))
};

type GamerAddProps = {
    recaptchaSiteKey: string,
    baseUrl?: string,
    onAdd?: (gamer: Gamer) => void,
    doNotSubmit?: boolean
}

export default function GamerAdd({recaptchaSiteKey, onAdd, doNotSubmit, baseUrl}: GamerAddProps) {

    const recaptcha = React.createRef<GoogleReCaptchaProvider>();
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState('xbl');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});


    let loadingComponent = <div/>;

    if (loading) {
        loadingComponent = <Image style={{width: '50px', height: '50px'}} src={'/assets/images/spinner.gif'}/>;
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

            let response;

            if (doNotSubmit === true) {
                response = {
                    status: 200,
                    data: {
                        gamer: {
                            platform: 'test',
                            username: 'test',
                            isTest: true
                        }
                    }
                };
            } else {
                try {
                    response = await HttpService.http({
                        url: (baseUrl || '') + '/api/gamer',
                        method: 'POST',
                        body: {
                            username: newUserConfig.username,
                            platform: newUserConfig.platform,
                            token: token
                        }
                    });
                } catch (error) {
                    response = error;
                }
            }

            if (response && response.status === 200) {
                if (onAdd) {
                    onAdd(response.data.gamer);
                } else {
                    Router.push(response.data.url || ['gamer', newUserConfig.platform, encodeURIComponent(newUserConfig.username)].join('/'));
                }
            } else {
                let message: unknown = 'An unknown error occurred while trying to create the user';

                if ((response.data && response.data.userMessage)) {
                    message = response.data.userMessage as string;
                } else if (response && response.message) {
                    message = response.message as string;
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

                <Alert type={message['type']}
                       hideIfEmpty>
                    {message['message']}
                </Alert>

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

                <Button onClick={() => addGamer()}>
                    Add Gamer
                </Button>
            </Box>

        </GoogleReCaptchaProvider>
    );
}