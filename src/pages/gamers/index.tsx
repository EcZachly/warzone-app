import {GetServerSideProps} from 'next'
import React, {useState} from "react";

import {Container, Header, LineBreak, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import {SidebarCompanion, Sidebar} from '../../components/SmartComponents';
import {GamerCard, GamerAdd} from './../../components/gamer/index';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function Gamers({gamers, hostname, recaptchaSiteKey}){
    let gamerList = gamers.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>);
    return (
        <Page title={'Gamers'}>
            <Navbar/>
            <Main>
                <Container mode={'sidebar'} size={'lg'}>
                    <Sidebar>
                        <Header>
                            All Gamers
                        </Header>
                        <LineBreak/>
                        <GamerAdd recaptchaSiteKey={recaptchaSiteKey} hostname={hostname}/>
                    </Sidebar>

                    <SidebarCompanion>
                        {gamerList}
                    </SidebarCompanion>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return {props: {gamers: gamerJson, hostname: process.env.HOSTNAME, recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY}}
}