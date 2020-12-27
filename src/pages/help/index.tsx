import {Footer, Navbar, Page} from './../../components/AppComponents';
import {Container, Header, Main} from './../../components/SimpleComponents';
import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Warzone In-Game Help'}>
            <Navbar/>

            <Container>
                <Main>
                    <Header>Resources</Header>

                    <a href={'/help/bunkers'}>View Red Access Card Bunker Locations</a>
                </Main>
            </Container>

            <Footer/>
        </Page>
    );
}