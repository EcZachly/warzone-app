import React from 'react';

import {Footer, Navbar, Page} from './../components/AppComponents';
import {Box, Container, Header, LineBreak, Main, Small} from './../components/SimpleComponents';
import {GetServerSideProps} from 'next';
import {getBaseUrlWithProtocol} from '../services/UtilityService';
import {GAME_CATEGORIES} from '../../lib/constants';

import {GamerSearchInput} from './../components/gamer';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const Home = ({baseUrl}) => {
    return (
        <Page title={'Warzone'} redirectIfLoggedIn={true}>
            <Navbar/>

            <Main>
                {/*<Alert type={'secondary'} style={{margin: 0, borderRadius: 0}}>*/}
                {/*    <Container>*/}
                {/*        You can now create a user with brshooter.com to track your gamer and friends, <a*/}
                {/*        href={'/signup'}>sign up here</a>*/}
                {/*    </Container>*/}
                {/*</Alert>*/}

                <Box id={'section-display'}>
                    <Container>
                        <Header size={'xl'}>
                            WARZONE

                            <LineBreak clear/>

                            <Small>
                                Stats Tracker
                            </Small>
                        </Header>

                        <LineBreak clear/>

                        <GamerSearchInput
                            gameCategory={GAME_CATEGORIES.WARZONE}
                            focus={true}
                            size={'xl'}
                            baseUrl={baseUrl}/>
                    </Container>

                </Box>


                <Box id={'section-overview'}>
                    <Container>
                        <Box className={'info-container'}>

                            <Box className={'info-box'}>
                                <Header>Gamers</Header>

                                <a href={'/gamers'}>
                                    View all Gamers
                                </a>
                            </Box>

                            <Box className={'info-box'}>
                                <Header>Squads</Header>

                                <a href={'/squads'}>
                                    View all Squads
                                </a>
                            </Box>

                            <Box className={'info-box'}>
                                <Header>Resources</Header>

                                <a href={'/help/bunkers'}>
                                    Red Access Card Bunker Locations
                                </a>
                            </Box>

                        </Box>
                    </Container>
                </Box>
            </Main>

            <Footer/>
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);
    return {
        props: {
            baseUrl: baseUrl,
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    };
};

export default Home;