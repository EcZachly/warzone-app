import Head from 'next/head'

import {Navbar, Page} from './../../components/AppComponents';
import {Container, Header, Main} from './../../components/SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Warzone In-Game Help'}>
            <Navbar/>

            <Container>
                <Main>
                    <Header>Warzone</Header>

                    <a href={'/help/bunkers'}>View Red Access Card Bunker Locations</a>
                </Main>
            </Container>
        </Page>
    );
}