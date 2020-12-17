import React, {useState, useEffect, Component} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';

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
    LineBreak, UnorderedList, ListItem, Show
} from './../components/SimpleComponents';
import {Input, LabelValue, Sidebar, SidebarCompanion} from './../components/SmartComponents';

import CONSTANTS from './../config/CONSTANTS';

import {UserService} from './../components/Users';
import {GamerRelationshipService} from './../components/GamerRelationships';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    let router = useRouter();

    let user = UserService.getUser();

    useEffect(() => {
        getData();
    });

    console.log(user);

    return (
        <Page title={'Dashboard'} loginRequired={true}>
            <Navbar/>

            <Main>
                <Container size={'lg'} mode={'sidebar'}>

                    <Sidebar>
                        <Header>{user.first_name}</Header>

                        <LineBreak/>


                    </Sidebar>



                    <SidebarCompanion>



                    </SidebarCompanion>

                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    function getData() {
        getGamerRelationships();
    }



    function getGamerRelationships() {
        GamerRelationshipService.queryGamerRelationships({
            user_id: user.user_id
        }).then((gamerRelationships) => {
            console.log('gamerRelationships', gamerRelationships);
        }).catch((error) => {
            console.error(error);
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});