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


let DashboardPage = ({baseUrl}) => {

    let router = useRouter();
    let user = UserService.getUser();
    console.log(user);

    return (
        <Page title={'Dashboard'} loginRequired={true}>
            <Navbar/>

            <Main>
                <Container size={'sm'}>

                    <Header>Hello, {user && user.first_name}</Header>

                    <Paragraph>Content Coming Soon</Paragraph>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );


};


export default DashboardPage;