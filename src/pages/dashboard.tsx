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
import {GamerSearchInput} from '../components/gamer';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    let router = useRouter();

    let [hasMounted, setHasMounted] = useState(false);
    let [loading, setLoading] = useState(true);
    let [dataHasLoaded, setDataHasLoaded] = useState(false);
    let [error, setError] = useState(null);

    let [user, setUser] = useState(null);
    let [gamerRelationships, setGamerRelationships] = useState([]);

    hasMounted === false && setHasMounted(true);

    useEffect(() => {
        if (UserService.userIsLoggedIn()) {
            setUser(UserService.getUser());
        }
    }, [hasMounted]);

    useEffect(() => {
        if (user && dataHasLoaded === false) {
            console.log('user is logged in');
            getData();
        }
    }, [user]);

    console.log(user);

    return (
        <Page title={'Dashboard'} loginRequired={true}>
            <Navbar/>

            <Main>
                <Container size={'lg'} mode={'sidebar'}>
                    {getContent()}
                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    function getContent() {
        if (user && loading !== true) {
            return (
                <>
                    <Sidebar>
                        <Header>{user.first_name}</Header>

                        <LineBreak/>

                    </Sidebar>



                    <SidebarCompanion>

                        <GamerSearchInput size={'lg'}
                                          baseUrl={baseUrl}
                                          focus={false}/>

                    </SidebarCompanion>
                </>
            );
        }
    }



    function getData() {
        console.log('get data');
        getGamerRelationships().finally(() => {
            setLoading(false);
            setDataHasLoaded(true);
        });
    }



    function getGamerRelationships() {
        return new Promise((resolve, reject) => {

            GamerRelationshipService.queryGamerRelationships({
                user_id: user.user_id
            }).then((_gamerRelationships) => {
                console.log('_gamerRelationships', _gamerRelationships);
                setGamerRelationships(_gamerRelationships);
                resolve();
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});