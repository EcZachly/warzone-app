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
    Alert,
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
import {AnyObject} from '../../lib/components/Types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const DashboardPage = ({baseUrl}) => {
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
            content: addFriend
        }]
    };

    let defaultView = 'overview';

    const router = useRouter();

    const [hasMounted, setHasMounted] = useState(false);
    // let [loading, setLoading] = useState(true);
    const [newUserSearch, setNewUserSearch] = useState('search');
    const [gameCategory, setCategory] = useState(GAME_CATEGORIES.WARZONE);
    const [view, setView] = useState(defaultView);
    const [contentView, setContentView] = useState('recent_matches');
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({type: null, time: null, message: null});

    const [userState, setUserState] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData()));
    const [gamerRelationshipsState, setGamerRelationshipsState] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData([])));
    const [recentMatchesState, setRecentMatchesState] = StateService.defaultStateDataUpdater(useState(StateService.defaultStateData([] as MatchList)));

    hasMounted === false && setHasMounted(true);

    useEffect(() => {
        if (UserService.userIsLoggedIn()) {
            setUserState({
                loading: false,
                data: UserService.getUser(),
                error: null
            });
        }
    }, [hasMounted]);


    useEffect(() => {
        if (alert && alert.message) {
            setTimeout(() => {
                setAlert({message: null, type: null, time: 3000});
            }, (alert && alert.time) || 3000);
        }
    }, [alert]);


    useEffect(() => {
        if (userState.data) {
            getData(view, gameCategory);
        }
    }, [userState]);

    let title = 'Dashboard';
    if (userState.data) {
        title = `${userState.data.first_name}'s Dashboard`;
    }

    return (
        <Page title={title} loginRequired={true}>
            <Navbar/>

            <Main>
                <Container size={'lg'}>
                    <Alert type={alert.type} hideIfEmpty={true}>{alert.message}</Alert>
                </Container>

                <Container size={'lg'} mode={'sidebar'}>
                    {getContent()}
                </Container>
            </Main>

            <Footer/>
        </Page>
    );

    function getContent() {



        if (!userState.loading) {
            const mainGamer = getMainGamer();
            const platform = mainGamer && mainGamer.platform;
            const username = mainGamer && mainGamer.username;
            const gamerEndpoint = '/gamer/' + encodeURIComponent(platform) + '/' + encodeURIComponent(username);

            return (
                <>
                    <Sidebar>
                        <Header>{userState.data.first_name}</Header>

                        <LineBreak/>

                        <Show show={gamerRelationshipsState.loading}>
                            <Placeholder text/>
                            <LineBreak clear/>
                            <Placeholder text/>
                        </Show>

                        <Show show={!gamerRelationshipsState.loading && !!mainGamer}>
                            <GamerLinkList loading={gamerRelationshipsState.loading} gamer={mainGamer}/>

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

                            {getFriendsOnFire()}
                        </Show>
                    </Sidebar>


                    <SidebarCompanion>
                        <Show show={!gamerRelationshipsState.loading && !!mainGamer}>
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
        return gamerRelationshipsState.loading !== true && gamerRelationshipsState.data.filter(({type}) => type === 'self')[0];
    }



    function getCategorySwitcher() {
        if (gamerRelationshipsState.loading) {
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
        if (recentMatchesState.error) {
            return (
                <Alert type={'error'}>
                    {recentMatchesState.error}
                </Alert>
            );
        } else if (recentMatchesState.loading) {
            return (
                <Card>
                    <CardBody>
                        <Placeholder title/>
                        <LineBreak clear/>
                        <Placeholder paragraph/>
                    </CardBody>
                </Card>
            );
        } else if (recentMatchesState.data.length) {
            return (
                <MatchCardList matches={recentMatchesState.data}/>
            );
        } else {
            return (
                <Paragraph>
                    No Recent Matches.

                    <Paragraph>
                        <Text italic>
                            It may take some time for us to gather match info, but we'll get it soon.
                        </Text>
                    </Paragraph>
                </Paragraph>
            );
        }
    }



    function getActiveTab() {
        return CONFIG.TAB_VIEW_LIST.filter(({id}) => contentView === id)[0];
    }



    function addFriend() {

        return (
            <Box>
                <Paragraph>
                    Add your friends to follow them, see their recent games, and compare stats. <Text italic>
                    You'll also see when they're on a hot streak!
                </Text>
                </Paragraph>

                <CreateGamerRelationship user={userState.data}
                                         onGamerAdd={(gamerRelationship) => {
                                             setAlert({
                                                 message: 'Friend successfully added',
                                                 type: 'success',
                                                 time: 3000
                                             });

                                             getData(view, gameCategory);
                                         }
                                         }/>
            </Box>
        );
    }



    function getGamerList() {
        const mainGamer = gamerRelationshipsState.data.filter((r) => r.type === 'self')[0];
        const friends = gamerRelationshipsState.data.filter((r) => r.type === 'friend');

        if (gamerRelationshipsState.loading) {
            return (
                <Box>
                    {getCategorySwitcher()}
                    <GamerCard loading={gamerRelationshipsState.loading}/>
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
                                        <GamerCard loading={gamerRelationshipsState.loading}
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
        const friends = gamerRelationshipsState.data.filter((gamerConfig) => {
            return _.get(gamerConfig, 'detailData.gamer.heat_rating') > 0;
        });

        if (gamerRelationshipsState.loading) {
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
        if (!gamerRelationshipsState.loading && gamerRelationshipsState.data.length === 0) {
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
                    user_id: userState.data.user_id,
                    username: username,
                    platform: platform,
                    type: 'self'
                }).then(() => getData(view, gameCategory)).catch(console.log);
            }
        }
    }


    function getData(view, category) {
        return getGamerRelationships().then((gamerRelationships) => {
            if (gamerRelationships.length === 1) {
                setContentView('add-friends');
            }

            getRecentMatches(gamerRelationships);
            getGamerRelationshipDetails(gamerRelationships);
        });
    }



    function getGamerRelationshipDetails(gamerRelationships) {
        let platformUsernameList = gamerRelationships.map(GamerService.generatePlatformUsername);

        GamerService.queryGamers({
            platform_username: platformUsernameList,
            game_category: GamerService.getDefaultGameCategory()
        }).then((gamers) => {
            let gamerPlatformUsernameMap = gamers.reduce((map, gamer) => {
                // @ts-ignore
                map[gamer.platform_username] = gamer;
                return map;
            }, {});

            let newGamerRelationships = gamerRelationships.map((gamerRelationship) => {
                let platformUsername = GamerService.generatePlatformUsername(gamerRelationship);
                gamerRelationship.detailData = {
                    gamer: gamerPlatformUsernameMap[platformUsername]
                };

                return gamerRelationship;
            });

            setGamerRelationshipsState({
                loading: false,
                data: JSON.parse(JSON.stringify(newGamerRelationships))
            });
        }).catch((error) => {
            console.log(error);
        });
    }



    async function getRecentMatches(gamerRelationships) {
        console.log('getRecentMatches');

        const gamerRelationshipsIDList = gamerRelationships.map(({username, platform}) => {
            return [platform, username].join('-');
        });

        const query = {
            platform_username: gamerRelationshipsIDList,
            game_category: 'Warzone'
        };

        const queryOptions = {
            baseUrl,
            limit: 20,
            order: [{field: 'end_timestamp', direction: 'desc'}]
        };

        try {
            let gamerMatches = await GamerMatchService.queryGamerMatches(query, queryOptions);

            console.log(gamerMatches);

            setRecentMatchesState({
                data: GamerMatchService.combineGamerMatches(gamerMatches),
                loading: false
            });
        } catch (error) {
            console.error(error);

            setRecentMatchesState({
                loading: false,
                error: 'An unknown error occurred while getting the recent matches'
            });
        }
    }



    function getGamerDetails(username, platform, view = 'overview', category = GAME_CATEGORIES.WARZONE) {
        return GamerService.getGamerDetailView(username, platform, view, category);
    }


    function getGamerRelationships(): Promise<GamerRelationshipList> {
        return GamerRelationshipService.queryGamerRelationships({
            user_id: userState.data.user_id
        });
    }
};


export default dynamic(() => Promise.resolve(DashboardPage), {ssr: false});