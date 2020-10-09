import React, {useState, Component} from 'react';

import {Navbar, Page, Footer} from './../components/AppComponents';
import {Container, Header, Box, Text, Small, Main, LineBreak} from './../components/SimpleComponents';
import {Input} from './../components/SmartComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    const [searchInputValue, updateSearchInputValue] = useState('');
    return (
        <Page title={'Warzone'}>
            <Navbar/>

            <Main>
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

                        <Input onChange={updateSearchInputValue}
                               placeholder={'Search Gamers'}
                               mode={'plain'}
                               focus
                               inputStyle={{borderRadius: 0, borderBottom: '1px solid #888'}}
                               size={'xl'}
                               helpMessage={'This input does nothing yet'}/>
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
}