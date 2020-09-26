import Head from 'next/head'
import {GetServerSideProps} from 'next'
import GamerCard from '../../components/gamer/GamerCard';

import {Container, Header, Main} from './../../components/SimpleComponents';
import {Page} from './../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({gamers}) {
    return (
        <Page title={'Gamers'}>
            <Container>
                <Main>
                    {gamers.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>)}
                </Main>
            </Container>
        </Page>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return {props: {gamers: gamerJson}}
}