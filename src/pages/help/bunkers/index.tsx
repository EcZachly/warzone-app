import React from 'react';

import {Footer, Navbar, Page} from './../../../components/AppComponents';
import {Container, Header, Image, Main, Small} from './../../../components/SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export default function Bunkers() {
    return (
        <Page title={'Red Access Card Locations'}>
            <Navbar/>

            <Container>

                <Main>
                    <Header>
                        Red Access Card Bunker Locations
                    </Header>

                    <Image style={{width: '100%', height: 'auto'}}
                           alt="This shows where each Warzone bunker is that can be accessed via the loot drop called Red Access Card"
                           src={'/assets/images/help/red-access-card.jpeg'}/>

                    <Small>Image Credit: Infinity Ward</Small>
                </Main>

            </Container>

            <Footer/>
        </Page>
    );
}