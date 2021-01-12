import React from 'react';

import {Footer, Navbar, Page} from './../components/AppComponents';
import {
    Box,
    Container,
    Text,
    Button,
    Image,
    Header,
    Card,
    Paragraph,
    LineBreak,
    Main,
    Small,
    Alert,
    CardImage
} from './../components/SimpleComponents';
import {GetServerSideProps} from 'next';
import {getBaseUrlWithProtocol} from '../services/UtilityService';
import {GAME_CATEGORIES, BASE_TITLE} from '../../lib/constants';

import {GamerSearchInput} from './../components/gamer';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const Home = ({baseUrl}) => {
    return (
        <Page title={`${BASE_TITLE}: Home Page`} redirectIfLoggedIn={true}>
            <Navbar/>
            <Main>
                {/*<Alert type={'blue'} style={{margin: 0, borderRadius: 0}}>*/}
                {/*    <Container>*/}
                {/*        <Paragraph style={{padding: 0}}>*/}
                {/*            You can now create an account with BRStats to track your stats and friends. <a*/}
                {/*            href={'/signup'}>Sign Up here!</a>*/}
                {/*        </Paragraph>*/}
                {/*    </Container>*/}
                {/*</Alert>*/}

                <Box id={'section-display'}>
                    <Container>
                        <Header size={'xl'} style={{marginBottom: 0}}>
                            BR Stats
                        </Header>

                        <Header size={'lg'} style={{marginTop: 0}}>
                            WARZONE <Small>
                            Stats Tracker
                        </Small>
                        </Header>

                        <LineBreak clear/>

                        <GamerSearchInput gameCategory={GAME_CATEGORIES.WARZONE}
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


                <Box id={'section-about'}>
                    <Container size={'sm'}>
                        <Paragraph style={{fontSize: '1.4em'}}>
                            <Text bold>BR Stats</Text> is a <Text italic>Call of Duty: Warzone</Text> stat tracking
                                                       platform where you can view detailed information about your
                                                       performance, matches, trends, teammates, and squads. {/*You can <a*/}
                            {/*href={'signup'}>create an account</a> to get personalized recommendations and see how your*/}
                            {/*                           friends*/}
                            {/*                           are doing <Text italic>on fire!</Text>*/}
                        </Paragraph>
                    </Container>
                </Box>


                <Box id={'section-features'}>
                    <Box className={'info-container'}>
                        <Container>

                            <Box className={'details'}>
                                <Header size={'md'}>
                                    Follow your Friends
                                </Header>

                                <Paragraph>
                                    Add your friends, watch their progress, and see their recent game.
                                </Paragraph>

                                <a href={'/gamers'}>
                                    <Button type={'primary'}>
                                        Browse All Gamers
                                    </Button>
                                </a>
                            </Box>

                            <Card className={'image'}>
                                <CardImage src={'/assets/images/home/friends-sm.png'}
                                           alt={'Friend cards with stats and heat scores'}/>
                            </Card>
                        </Container>
                    </Box>


                    <Box className={'info-container accent'}>
                        <Container>

                            <Card className={'image'}>
                                <CardImage src={'/assets/images/home/trends.png'}
                                           alt={'A trend-line detailing your KDR changes over time'}/>
                            </Card>

                            <Box className={'details'}>
                                <Header size={'md'}>
                                    See your Progression
                                </Header>

                                <Paragraph>
                                    View detailed charts of how you've progressed and improved over time
                                </Paragraph>

                                <Button type={'primary'} onClick={() => {
                                    window.scrollTo(0, 0);
                                }}>
                                    Search Gamers
                                </Button>
                            </Box>

                        </Container>
                    </Box>


                    <Box className={'info-container'}>
                        <Container>
                            <Box className={'details'}>
                                <Header size={'md'}>
                                    Track your Squads
                                </Header>

                                <Paragraph>
                                    See how you and your favorite teams perform
                                </Paragraph>

                                <a href={'/squads'}>
                                    <Button type={'primary'}>
                                        Browse Squads
                                    </Button>
                                </a>
                            </Box>

                            <Card className={'image'}>
                                <CardImage src={'/assets/images/home/squad.png'}
                                           alt={'Squad card with stats'}/>
                            </Card>
                        </Container>
                    </Box>


                    <Box className={'info-container accent'}>
                        <Container>

                            <Card className={'image'}>
                                <CardImage src={'/assets/images/home/match.png'}
                                           alt={'Match card with stats'}/>
                            </Card>

                            <Box className={'details'}>
                                <Header size={'md'}>
                                    Match Details
                                </Header>

                                <Paragraph>
                                    See your performance for recent matches, including score, damage, placement and KDR
                                </Paragraph>

                                <a href={'/gamers'}>
                                    <Button type={'primary'}>
                                        Find Gamers
                                    </Button>
                                </a>
                            </Box>

                        </Container>
                    </Box>

                </Box>

                {/*<Box id={'section-action'}>*/}
                {/*    <Container>*/}
                {/*        <Header textCenter>*/}
                {/*            Sign up or Start Browsing*/}
                {/*        </Header>*/}

                {/*        <Paragraph textCenter>*/}
                {/*            <a href={'/signup'} style={{marginRight: '.25em'}}>*/}
                {/*                Sign up for a free account*/}
                {/*            </a>*/}
                {/*            or <a href={'/gamers'}>*/}
                {/*            Browse gamers*/}
                {/*        </a> if you'd like to see more*/}
                {/*        </Paragraph>*/}
                {/*    </Container>*/}
                {/*</Box>*/}
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