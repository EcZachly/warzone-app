import React, {useState, useEffect, Component} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';

import {Navbar, Page, Footer, GamerCard, GamerCategoryTabs} from './../components/AppComponents';

import {
    Container,
    Header,
    Paragraph,
    Main,
    LineBreak,
    Show
} from './../components/SimpleComponents';

import {Input, LabelValue, Sidebar, SidebarCompanion} from './../components/SmartComponents';

import CONSTANTS from './../config/CONSTANTS';

import {UserService} from './../components/Users';
import {GamerRelationshipService} from './../components/GamerRelationships';
import {GamerSearchInput, GamerAdd, GamerService, GamerLinkList} from '../components/gamer';
import {Gamer} from '../components/gamer/GamerTypes';
import {GAME_CATEGORIES} from "../../lib/constants";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    let router = useRouter();

    let [hasMounted, setHasMounted] = useState(false);
    let [loading, setLoading] = useState(true);
    let [dataHasLoaded, setDataHasLoaded] = useState(false);
    let [newUserSearch, setNewUserSearch] = useState('search');
    let [gameCategory, setCategory] = useState(GAME_CATEGORIES.WARZONE);
    let [error, setError] = useState(null);

    let [user, setUser] = useState(null);
    let [gamerRelationships, setGamerRelationships] = useState([]);
    let mainGamer = gamerRelationships.length > 0 && gamerRelationships.filter(({type}) => type === 'self')[0] as Gamer;
    hasMounted === false && setHasMounted(true);

    console.log(gameCategory);
    useEffect(() => {
        if (UserService.userIsLoggedIn()) {
            setUser(UserService.getUser());
        }
    }, [hasMounted]);

    useEffect(() => {
        if (user) {
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
        const userHasAMain = !!mainGamer;
        if (user && loading !== true) {
            return (
                <>
                    <Sidebar>
                        <Header>{user.first_name}</Header>

                        <LineBreak/>

                        {userHasAMain && <GamerLinkList gamer={mainGamer} />}

                    </Sidebar>



                    <SidebarCompanion>
                        <GamerCategoryTabs activeCategory={gameCategory} setCategory={setCategory}/>

                        {userHasAMain && <GamerCard gamer={gamerRelationships[0].detailData.gamer} />}

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
                return GamerRelationshipService.createGamerRelationship({
                    user_id: user.user_id,
                    username: username,
                    platform: platform,
                    type: 'self'
                }).then(getGamerRelationships).catch(console.log);
            }
        }
    }



    function getData() {
        getGamerRelationships().finally(() => {
            setLoading(false);
            setDataHasLoaded(true);
        });
    }

    function getGamerDetails(username, platform, view = 'time', category = GAME_CATEGORIES.WARZONE){
        return GamerService.getGamerDetailView(username, platform, view, category).then((data)=>{
            return data;
        })
    }


    function getGamerRelationships() {
        return new Promise((resolve, reject) => {
            return GamerRelationshipService.queryGamerRelationships({
                user_id: user.user_id
            }).then((_gamerRelationships) => {
                let detailPromises = _gamerRelationships.map((gamer)=>{
                    return getGamerDetails(gamer.username, gamer.platform, 'time', gameCategory)
                })
                return Promise.all(detailPromises).then((data)=>{
                    data.forEach((row, index)=>{
                        _gamerRelationships[index].detailData = row
                    })
                    setGamerRelationships(_gamerRelationships);
                    resolve();
                })
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});