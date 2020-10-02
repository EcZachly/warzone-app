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

                    <LineBreak clear/>

                    <a href={'/gamers'}>
                        <Header size={'md'}>
                            View all Gamers
                        </Header>
                    </a>

                    <a href={'/squads'}>
                        <Header size={'md'}>
                            View all Squads
                        </Header>
                    </a>

                    <LineBreak/>

                    <a href={'/help/bunkers'}>
                        <Header size={'md'}>
                            View Red Access Card Bunker Locations
                        </Header>
                    </a>
                </Main>
            </Container>
        </Page>
    );
}