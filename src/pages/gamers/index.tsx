import {GetServerSideProps} from 'next'
import React, {useState} from "react";
import _ from 'lodash';

import {Container, Alert, Header, LineBreak, Button, Box, Main} from './../../components/SimpleComponents';
import {Page, Navbar} from './../../components/AppComponents';
import {SidebarCompanion, Input, Sidebar} from '../../components/SmartComponents';

import HttpService from './../../services/HttpService';

import {GamerCard, GamerService} from './../../components/gamer/index';

const CONFIG = {
    PLATFORM_OPTIONS: GamerService.getGamerPlatforms().map(({id, name}) => ({text: name, value: id}))
};

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default class Gamers extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            gamers: props.gamers,
            hostname: props.hostname,
            newUser: {
                value: '',
                platform: CONFIG.PLATFORM_OPTIONS[0].value,
                message: {
                    message: '',
                    type: ''
                }
            }
        };
    }


    render() {
        const state = this.state;
        const newUser = state.newUser;

        return (
            <Page title={'Gamers'}>
                <Navbar/>

                <Main>
                    <Container mode={'sidebar'} size={'lg'}>
                        <Sidebar>
                            <Header>
                                All Gamers
                            </Header>

                            <LineBreak/>

                            <Box>
                                <Header size={'sm'}>Add Gamer</Header>

                                <Input label={'Username'}
                                       type={'text'}
                                       value={newUser.value}
                                       onChange={(value) => this.updateFormItem('newUser', 'value', value)}
                                       placeholder={'Username'}/>

                                <Input label={'Platform'}
                                       type={'select'}
                                       options={CONFIG.PLATFORM_OPTIONS}
                                       value={newUser.platform}
                                       onChange={(value) => this.updateFormItem('newUser', 'platform', value)}/>

                                <Alert type={newUser.message.type}
                                       hideIfEmpty>
                                    {newUser.message.message}
                                </Alert>

                                <Button onClick={() => this.addGamer()}>
                                    Add Gamer
                                </Button>
                            </Box>
                        </Sidebar>

                        <SidebarCompanion>
                            {this.generateGamerListContent()}
                        </SidebarCompanion>
                    </Container>
                </Main>
            </Page>
        );
    }


    updateFormItem(formName, key, newValue) {
        let formConfig = this.state[formName];
        formConfig[key] = newValue;
        this.setState({[formName]: formConfig});
    }


    addGamer() {
        let newUserConfig = this.state.newUser;

        if (!newUserConfig.value) {
            this.updateFormItem('newUser', 'message', {message: 'Username is required', type: 'error'});
        } else if (!newUserConfig.platform) {
            this.updateFormItem('newUser', 'message', {message: 'Platform is required', type: 'error'});
        } else {
            this.updateFormItem('newUser', 'message', {message: '', type: ''});

            HttpService.http({
                method: 'POST',
                url: this.state.hostname + '/api/gamer',
                body: {
                    username: newUserConfig.value,
                    platform: newUserConfig.platform
                }
            }).then((response) => {
                console.log(response);

                if (response.status === 200) {

                } else {
                    let message = 'An unknown error occurred while trying to create the user';

                    if (response.data && response.data.userMessage) {
                        message = response.data.userMessage;
                    }

                    this.updateFormItem('newUser', 'message', {message: message, type: 'error'});
                }
            }).catch((error) => {
                this.updateFormItem('newUser', 'message', {
                    message: 'An unknown error occurred while trying to create the user',
                    type: 'error'
                });
            }).finally(() => {

            });
        }
    }


    generateGamerListContent() {
        return this.state.gamers.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>);
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return {props: {gamers: gamerJson, hostname: process.env.HOSTNAME}}
}