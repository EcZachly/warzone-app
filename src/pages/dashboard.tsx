import React, {useState, useEffect, Component} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';

import {Navbar, Page, Footer, GamerCard, GamerCategorySelect} from './../components/AppComponents';

import {
    Container,
    Header,
    Paragraph,
    Box,
    Main,
    LineBreak,
    Show, Image
} from './../components/SimpleComponents';

import {Input, LabelValue, Sidebar, SidebarCompanion} from './../components/SmartComponents';

import CONSTANTS from './../config/CONSTANTS';

import {UserService} from './../components/Users';
import {GamerRelationshipService} from './../components/GamerRelationships';
import {GamerRelationshipList} from '../components/GamerRelationships/GamerRelationshipTypes';
import {GamerSearchInput, GamerAdd, GamerService, GamerLinkList} from '../components/gamer';
import {Gamer} from '../components/gamer/GamerTypes';
import {GAME_CATEGORIES} from '../../lib/constants';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    let router = useRouter();

    let [hasMounted, setHasMounted] = useState(false);
    let [loading, setLoading] = useState(true);
    let [newUserSearch, setNewUserSearch] = useState('search');
    let [gameCategory, setCategory] = useState(GAME_CATEGORIES.WARZONE);
    let [view, setView] = useState('time');
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
        if (user) {
            console.log('user is logged in');
            getData(view, gameCategory);
        }
    }, [user]);


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
        console.log(gamerRelationships);
        const mainGamer = gamerRelationships.filter((r) => r.type === 'self')[0];

        const friends = gamerRelationships.filter((r) => r.type === 'friend');

        const userHasAMain = !!mainGamer;
        let categorySwitcher = (
            <GamerCategorySelect activeCategory={gameCategory} setCategory={(val) => {
                setCategory(val);
                return getData(view, val);
            }}/>
        );



        if (user) {
            let selfBlock = mainGamer && (
                <Box>
                    <GamerCard gamer={mainGamer.detailData.gamer}/>
                </Box>
            );

            let friendsBlock = (
                <Box>
                    <h1>Friends</h1>

                    {friends.map((friend) => <GamerCard gamer={friend.detailData.gamer}/>)}
                </Box>
            );

            let relationshipsBlock = (
                <Box>
                    {selfBlock}
                    {friendsBlock}
                </Box>
            );

            return (
                <>
                    <Sidebar>
                        <Header>{user.first_name}</Header>

                        <LineBreak/>
                        {userHasAMain && <GamerLinkList gamer={mainGamer}/>}
                        {loading && <Image style={{width: '50px', height: '50px'}} src={'/assets/images/spinner.gif'}/>}
                    </Sidebar>


                    <SidebarCompanion>
                        {userHasAMain && categorySwitcher}
                        {userHasAMain && relationshipsBlock}
                        {userHasNoRelationships && !loading && getNewUserContent()}


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
                    To get started, you'll need to select your main Warzone account to track. You'll only be able to
                    track 1 account as your main, but you can add friends and favorites later.
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
                }).then(() => getData(view, gameCategory)).catch(console.log);
            }
        }
    }


    function getData(view, category) {
        return getGamerRelationships().then((_gamerRelationships) => {
            let detailPromises = _gamerRelationships.map((gamer) => {
                return getGamerDetails(gamer.username, gamer.platform, view, category);
            });
            return Promise.all(detailPromises).then((data) => {
                data.forEach((row, index) => {
                    _gamerRelationships[index].detailData = row;
                });
                setGamerRelationships(JSON.parse(JSON.stringify(_gamerRelationships)));
                setLoading(false);
            });
        });
    }

    function getGamerDetails(username, platform, view = 'time', category = GAME_CATEGORIES.WARZONE) {
        return GamerService.getGamerDetailView(username, platform, view, category);
    }


    function getGamerRelationships(): Promise<GamerRelationshipList> {
        return GamerRelationshipService.queryGamerRelationships({
            user_id: user.user_id
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});