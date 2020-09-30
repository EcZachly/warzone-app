import {Alert, Box, Button, Header, ProgressBar} from "../SimpleComponents";
import {Input} from "../SmartComponents";
import React, {useState} from "react";
import {GamerService} from "./index";
import HttpService from "../../services/HttpService";
import Router from "next/router";

import {
    GoogleReCaptchaProvider,
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';


const CONFIG = {
    PLATFORM_OPTIONS: GamerService.getGamerPlatforms().map(({id, name}) => ({text: name, value: id}))
};


export default function GamerAdd({recaptchaSiteKey, hostname}) {

    const [username, setUsername] = useState("");
    const [platform, setPlatform] = useState("xbl");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});


    let loadingComponent = <div></div>;
    if(loading){
        //TODO make this a spinner
        loadingComponent = <ProgressBar/>
    }

    const addGamer = async () => {
        let newUserConfig = {username: username, platform: platform};
        let errorMessage = '';

        if (!newUserConfig.username) {
            errorMessage = 'Username is required';
        } else if (!newUserConfig.platform) {
            errorMessage = 'Platform is required';
        }
        if(!errorMessage) {
            setLoading(true);
            setMessage( {message: '', type: ''});
            let response = await HttpService.http({
                url: hostname + '/api/gamer',
                method: 'POST',
                body: {
                    username: newUserConfig.username,
                    platform: newUserConfig.platform,
                    token: token
                }
            })
            if (response.status === 200) {
                Router.push(response.data.url || ['gamer', newUserConfig.platform, encodeURIComponent(newUserConfig.username)].join('/'));
            } else {
                let message = 'An unknown error occurred while trying to create the user';
                if (response.data && response.data.userMessage) {
                    message = response.data.userMessage;
                }
                setMessage({message: message, type: 'error'});
            }
        }
        else{
            setMessage({message: errorMessage, type: 'error'});
        }
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <GoogleReCaptcha onVerify={token => setToken(token)} action="submit" />
            <Box>
                <Header size={'sm'}>Add Gamer</Header>
                <Input label={'Username'}
                       type={'text'}
                       value={username}
                       onChange={(username) => setUsername(username)}
                       placeholder={'Username'}/>

                <Input label={'Platform'}
                       type={'select'}
                       options={CONFIG.PLATFORM_OPTIONS}
                       value={platform}
                       onChange={(value) => setPlatform(value)}/>

                {loadingComponent}
                <Alert type={message.type}
                       hideIfEmpty>
                    {message.message}
                </Alert>

                <Button onClick={() => addGamer()}>
                    Add Gamer
                </Button>
            </Box>
        </GoogleReCaptchaProvider>
    )
}