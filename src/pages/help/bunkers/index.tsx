import Head from 'next/head'

import {Footer, Navbar, Page} from './../../../components/AppComponents';
import {Container, Header, Small, Main, Image} from './../../../components/SimpleComponents';
import React from "react";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function Home() {
    return (
        <Page title={'Red Access Card Locations'}>
            <Navbar/>

            <Container>

                <Main>
                    <Header>
                        Red Access Card Bunker Locations
                    </Header>

                    <Image style={{width: "100%", height: "auto"}}
                           alt="This shows where each Warzone bunker is that can be accessed via the loot drop called Red Access Card"
                           src={'/images/help/red-access-card.jpeg'}/>

                    <Small>Image Credit: Infinity Ward</Small>
                </Main>

            </Container>

            <Footer/>
        </Page>
    );
}