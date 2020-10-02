import Head from 'next/head'

import {Navbar, Page} from './../../../components/AppComponents';
import {Container, Header, Main, Image} from './../../../components/SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Red Access Card Locations'}>
            <Navbar/>
            <Container>
                <Main>
                    <Header>Red Access Card Bunker Locations</Header>
                    <small>Image Credit: Infinity Ward</small>
                    <Image alt="This shows where each Warzone bunker is that can be accessed via the loot drop called Red Access Card" style={{width: "100%", height: "auto"}} src={'/images/help/red-access-card.jpeg'}/>
                </Main>
            </Container>
        </Page>
    );
}