import {GetServerSideProps} from 'next'
import GamerCard from '../../components/gamer/GamerCard';

import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar} from './../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({gamers}) {
    return (
        <Page title={'Gamers'}>
            <Navbar/>

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