import Head from 'next/head'

import {Navbar, Page} from './../components/AppComponents';
import {Container, Header, Main} from './../components/SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Warzone'}>
            <Navbar/>
            
            <Container>
                <Main>
                    <Header>Warzone</Header>

                    <a href={'/gamers'}>View all gamers</a>
                </Main>
            </Container>
        </Page>
    );
}