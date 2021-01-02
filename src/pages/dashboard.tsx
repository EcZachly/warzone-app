import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import _ from 'lodash';

import {Footer, GamerCard, GamerCategorySelect, Navbar, Page} from './../components/AppComponents';

import {
    Box,
    Card,
    CardBody,
    Container,
    Header,
    LineBreak,
    ListGroup,
    ListGroupItem,
    Main,
    Paragraph,
    Show,
    Text
} from './../components/SimpleComponents';

import {Placeholder, Sidebar, SidebarCompanion, TabNav} from './../components/SmartComponents';

import {UserService} from './../components/Users';
import {GamerRelationshipService} from './../components/GamerRelationships';
import {GamerRelationshipList} from '../components/GamerRelationships/GamerRelationshipTypes';
import {GamerAdd, GamerHeat, GamerLinkList, GamerSearchInput, GamerService} from '../components/gamer';

import {MatchCardList} from './../components/Matches';
import {MatchList} from '../components/Matches/MatchTypes';

import {StateService} from './../components/State';
import {GAME_CATEGORIES} from '../../lib/constants';
import UtilityService from '../services/UtilityService';
import GamerMatchService from '../components/gamer_match/GamerMatchService';
import CreateGamerRelationship from '../components/GamerRelationships/CreateGamerRelationship';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


let DashboardPage = ({baseUrl}) => {
    const CONFIG = {
        TAB_VIEW_LIST: [{
            text: 'Recent Matches',
            id: 'recent_matches',
            content: getRecentMatchesContent
        }, {
            text: 'Friends',
            id: 'friends',
            content: getGamerList
        }, {
            text: 'Add Friends',
            id: 'add-friends',
            content: () => <CreateGamerRelationship user={user}/>
        }]
    };


    let router = useRouter();

    let [hasMounted, setHasMounted] = useState(false);
    // let [loading, setLoading] = useState(true);
    let [newUserSearch, setNewUserSearch] = useState('search');
    let [gameCategory, setCategory] = useState(GAME_CATEGORIES.WARZONE);
    let [view, setView] = useState('time');
    let [contentView, setContentView] = useState('recent_matches');
    let [error, setError] = useState(null);

    let [user, setUser] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData()));
    let [gamerRelationships, setGamerRelationships] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData([])));
    let [recentMatches, setRecentMatches] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData([] as MatchList)));
    // let [gamerRelationships, setGamerRelationships] = useState([]);

    hasMounted === false && setHasMounted(true);

    useEffect(() => {
        if (UserService.userIsLoggedIn()) {
            setUser({
                loading: false,
                data: UserService.getUser(),
                error: null
            });
        }
    }, [hasMounted]);


    useEffect(() => {
        if (user.data) {
            getData(view, gameCategory);
        }
    }, [user]);

    let title = 'Dashboard';
    if (user.data) {
        title = `${user.data.first_name}'s Dashboard`;
    }

    return (
        <Page title={title} loginRequired={true}>
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



        if (!user.loading) {
            const mainGamer = getMainGamer();
            let platform = mainGamer && mainGamer.platform;
            let username = mainGamer && mainGamer.username;
            let gamerEndpoint = '/gamer/' + encodeURIComponent(platform) + '/' + encodeURIComponent(username);

            return (
                <>
                    <Sidebar>
                        <Header>{user.data.first_name}</Header>

                        <LineBreak/>

                        <Show show={gamerRelationships.loading}>
                            <Placeholder text/>
                            <LineBreak clear/>
                            <Placeholder text/>
                        </Show>

                        <Show show={!gamerRelationships.loading && !!mainGamer}>
                                <GamerLinkList loading={gamerRelationships.loading} gamer={mainGamer}/>

                                <ListGroup>
                                    <ListGroupItem onClick={() => {
                                        router.push(gamerEndpoint + '?view=recent_matches');
                                    }}>
                                        View Recent Matches
                                    </ListGroupItem>

                                    <ListGroupItem onClick={() => {
                                        router.push(gamerEndpoint + '?view=trends');
                                    }}>
                                        View Trends
                                    </ListGroupItem>
                                </ListGroup>
                        </Show>

                        {getFriendsOnFire()}
                    </Sidebar>


                    <SidebarCompanion>
                        <Show show={!gamerRelationships.loading && !!mainGamer}>
                           <TabNav options={CONFIG.TAB_VIEW_LIST}
                                   value={contentView}
                                   onChange={({id}) => setContentView(id)}/>
                            {getTabContent()}
                        </Show>
                        {getNewUserContent()}
                    </SidebarCompanion>
                </>
            );
        }
    }


    function getMainGamer() {
        return gamerRelationships.loading !== true && gamerRelationships.data.filter(({type}) => type === 'self')[0];
    }



    function getCategorySwitcher() {
        if (gamerRelationships.loading) {
            return (
                <Placeholder style={{height: '2em', width: '100%', marginTop: '20px'}}
                             block/>
            );
        } else {
            if (!!getMainGamer()) {
                return (
                    <GamerCategorySelect activeCategory={gameCategory}
                                         setCategory={(val) => {
                                             setCategory(val);
                                             return getData(view, val);
                                         }}/>
                );
            }
        }
    }



    function getTabContent() {
        return getActiveTab().content();
    }



    function getRecentMatchesContent() {
        if (recentMatches.loading) {
            return (
                <Card>
                    <CardBody>
                        <Placeholder title/>
                        <LineBreak clear/>
                        <Placeholder paragraph/>
                    </CardBody>
                </Card>
            );
        } else if (recentMatches.data.length) {
            return (
                <MatchCardList matches={recentMatches.data}/>
            );
        } else {
            return (
                <Text>No Recent Matches</Text>
            );
        }
    }



    function getActiveTab() {
        return CONFIG.TAB_VIEW_LIST.filter(({id}) => contentView === id)[0];
    }



    function getGamerList() {
        const mainGamer = gamerRelationships.data.filter((r) => r.type === 'self')[0];
        const friends = gamerRelationships.data.filter((r) => r.type === 'friend');

        if (gamerRelationships.loading) {
            return (
                <Box>
                    {getCategorySwitcher()}
                    <GamerCard loading={gamerRelationships.loading}/>
                </Box>
            );
        } else {
            return (
                <Box>
                    {getCategorySwitcher()}

                    <Box>
                        {
                            (() => {
                                if (mainGamer) {
                                    return (
                                        <GamerCard loading={gamerRelationships.loading}
                                                   gamer={mainGamer && mainGamer.detailData.gamer}/>
                                    );
                                }
                            })()
                        }
                    </Box>

                    <Box>
                        <h2>Friends</h2>

                        {
                            (() => {
                                if (friends.length) {
                                    return friends.map((friend) => <GamerCard gamer={friend.detailData.gamer}/>);
                                } else {
                                    return (
                                        <Text type={'help'}>No friends added</Text>
                                    );
                                }
                            })()
                        }
                    </Box>
                </Box>
            );
        }
    }



    function getFriendsOnFire() {
        const friends = gamerRelationships.data.filter((gamerConfig) => {
            return _.get(gamerConfig, 'detailData.gamer.heat_rating') > 0;
        });

        if (gamerRelationships.loading) {
            return (
                <Box>
                    <LineBreak clear/>
                    <Placeholder title/>
                    <LineBreak clear/>
                    <Placeholder text/>
                </Box>
            );
        } else {
            return (
                <Box style={{marginTop: '15px'}}>
                    <h4>Friends on Fire</h4>

                    {
                        (() => {
                            if (friends.length) {
                                return UtilityService.sortArrayOfObjectsByKey(friends, 'detailData.gamer.heat_score', true).map((friend) => {
                                    return (
                                        <Card style={{marginBottom: '5px'}}>
                                            <CardBody>
                                                <GamerLinkList gamer={friend.detailData.gamer}/>
                                                <GamerHeat size={'sm'} gamer={friend.detailData.gamer}/>
                                            </CardBody>
                                        </Card>
                                    );
                                });
                            } else {
                                return (
                                    <Text type={'help'}>No friends on fire</Text>
                                );
                            }
                        })()
                    }
                </Box>
            );
        }
    }


    function getNewUserContent() {
        if (!gamerRelationships.loading && gamerRelationships.data.length === 0) {
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

                    <GamerAdd recaptchaSiteKey={process.env.NEXT_PUBLIC_WARZONE_RECAPTCHA_SITE_KEY}
                              onAdd={(gamer) => newUserGamerSelect(gamer, true)}/>
                </Show>
            </>
            );
        }
    }


    function newUserGamerSelect(gamer, skipConfirmation?) {
        if (gamer) {
            const {username, platform} = gamer;
            let userIsOkay = true;

            if (skipConfirmation !== true) {
                userIsOkay = confirm(`select OK to make ${username} (${GamerService.getPlatformObjByID(platform).name}) your main`);
            }

            if (userIsOkay) {
                return GamerRelationshipService.createGamerRelationship({
                    user_id: user.data.user_id,
                    username: username,
                    platform: platform,
                    type: 'self'
                }).then(() => getData(view, gameCategory)).catch(console.log);
            }
        }
    }


    function getData(view, category) {
        return getGamerRelationships().then((_gamerRelationships) => {
            getRecentMatches(_gamerRelationships);

            let detailPromises = _gamerRelationships.map((gamer) => {
                return getGamerDetails(gamer.username, gamer.platform, view, category);
            });

            return Promise.all(detailPromises).then((data) => {
                data.forEach((row, index) => {
                    _gamerRelationships[index].detailData = row;
                });

                setGamerRelationships({
                    data: JSON.parse(JSON.stringify(_gamerRelationships)),
                    loading: false
                });
            });
        });
    }



    function getRecentMatches(_gamerRelationships) {
        const gamerRelationshipsIDList = _gamerRelationships.map(({username, platform}) => {
            return [platform, username].join('-');
        });
        
        let query = {
            platform_username: gamerRelationshipsIDList
        };

        let queryOptions = {
            baseUrl,
            limit: 20,
            order: [{field: 'end_timestamp', direction: 'desc'}]
        };

        GamerMatchService.queryGamerMatches(query, queryOptions).then((gamerMatches) => {
            setRecentMatches({
                data: GamerMatchService.combineGamerMatches(gamerMatches),
                loading: false
            });
        });
        console.log(gamerRelationshipsIDList);
    }



    function getGamerDetails(username, platform, view = 'time', category = GAME_CATEGORIES.WARZONE) {
        return GamerService.getGamerDetailView(username, platform, view, category);
    }


    function getGamerRelationships(): Promise<GamerRelationshipList> {
        return GamerRelationshipService.queryGamerRelationships({
            user_id: user.data.user_id
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});