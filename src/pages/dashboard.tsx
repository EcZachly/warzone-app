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
import {GamerRelationshipList} from '../components/GamerRelationships/GamerRelationshipTypes';
import {GamerSearchInput, GamerAdd, GamerService, GamerLinkList} from '../components/gamer';
import {Gamer} from '../components/gamer/GamerTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    let router = useRouter();

    let [hasMounted, setHasMounted] = useState(false);
    let [loading, setLoading] = useState(true);
    let [dataHasLoaded, setDataHasLoaded] = useState(false);
    let [newUserSearch, setNewUserSearch] = useState('search');
    let [error, setError] = useState(null);

    let [user, setUser] = useState(null);
    let [gamerRelationships, setGamerRelationships] = useState([]);
    let [gamers, setGamers] = useState([]);

    let mainRelationship = gamerRelationships.length > 0 && gamerRelationships.filter(({type}) => type === 'self')[0];
    let mainGamer = mainRelationship && gamers.length > 0 && gamers.filter(({username, platform}) => mainRelationship.username === username && mainRelationship.platform === platform)[0] as Gamer;

    console.log(mainRelationship);

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
        const userHasNoRelationships = (gamerRelationships.length === 0);
        const userHasAMain = !!mainRelationship;

        if (user && loading !== true) {
            return (
                <>
                    <Sidebar>
                        <Header>{user.first_name}</Header>

                        <LineBreak/>

                        <GamerLinkList gamer={mainRelationship}/>

                    </Sidebar>



                    <SidebarCompanion>



                        {userHasAMain && <GamerCard gamer={mainGamer}/>}

                        {userHasNoRelationships && getNewUserContent()}



                    </SidebarCompanion>
                </>
            );
        }
    }



    function getNewUserContent() {

        return (
            <>
                <Header size={'lg'}>
                    Welcome to BR Shooter
                </Header>

                <Paragraph>
                    To get started, you'll need to select your main Warzone account to track. You'll only be able to track 1 account as your main, but you can add friends and favorites later.
                </Paragraph>

                <Show show={newUserSearch === 'search'}>
                    <Paragraph>
                        If you account is already in our system, you can search for it below, or <a
                        onClick={() => setNewUserSearch(newUserSearch === 'search' ? 'create' : 'search')}>
                        you can add your new account and we'll start tracking your stats right away</a>
                    </Paragraph>

                    <GamerSearchInput size={'lg'}
                                      baseUrl={baseUrl}
                                      mode={'condensed'}
                                      onGamerClick={newUserGamerSelect}
                                      focus={false}/>
                </Show>

                <Show show={newUserSearch === 'create'}>
                    <Paragraph>
                        You can add your gamer details, or <a
                        onClick={() => setNewUserSearch(newUserSearch === 'search' ? 'create' : 'search')}>
                        if your account is already in our system, you can search for it here
                    </a>
                    </Paragraph>

                    <GamerAdd recaptchaSiteKey={process.env.NEXT_PUBLIC_WARZONE_RECAPTCHA_SITE_KEY}/>
                </Show>
            </>
        );
    }



    function newUserGamerSelect(gamer) {
        if (gamer) {
            const {username, platform} = gamer;

            let userIsOkay = confirm(`select OK to make ${username} (${GamerService.getPlatformObjByID(platform).name}) your main`);

            if (userIsOkay) {
                GamerRelationshipService.createGamerRelationship({
                    user_id: user.user_id,
                    username: username,
                    platform: platform,
                    type: 'self'
                }).then((gamerRelationship) => {
                    console.log(gamerRelationship);
                    getGamerRelationships().finally();
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }



    function getData() {
        console.log('get data');
        getGamerRelationships().then((_gamerRelationships) => {
            getGamers(_gamerRelationships).finally(() => {
                setLoading(false);
                setDataHasLoaded(true);
            });
        });
    }



    function getGamerRelationships(): Promise<GamerRelationshipList> {
        return new Promise((resolve, reject) => {

            GamerRelationshipService.queryGamerRelationships({
                user_id: user.user_id
            }).then((_gamerRelationships) => {
                console.log('_gamerRelationships', _gamerRelationships);
                setGamerRelationships(_gamerRelationships);
                resolve(_gamerRelationships);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }



    function getGamers(_gamerRelationships): Promise<void> {
        return new Promise((resolve, reject) => {
            GamerService.queryGamers({
                platform_username: _gamerRelationships.map(({username, platform}) => `${username}-${platform}`),
                game_category: '(all)'
            }).then((_gamers) => {
                console.log('_gamers', _gamers);

                setGamers(_gamers);
                resolve();
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});