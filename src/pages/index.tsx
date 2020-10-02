import Head from 'next/head'

import {Navbar, Page} from './../components/AppComponents';
import {Container, Header, Main, LineBreak} from './../components/SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Warzone'}>
            <Navbar/>
            
            <Container>
                <Main>
                    <Header>Warzone</Header>
                    <a href={'/gamers'}>View all Gamers</a>
                    <LineBreak />
                    <a href={'/squads'}>View all Squads</a>
                    <LineBreak/>
                    <a href={'/help/bunkers'}>View Red Access Card Bunker Locations</a>
                </Main>
            </Container>
        </Page>
    );
}