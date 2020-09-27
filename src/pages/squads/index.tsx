import {GetServerSideProps} from 'next'
import SquadCard from '../../components/squad/SquadCard';

import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar} from './../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Squads({squads}) {
    return (
        <Page title={'Squads'}>
            <Navbar/>

            <Container>
                <Main>
                    {squads.map((squad) => <SquadCard key={squad.team_grain} squad={squad}/>)}
                </Main>
            </Container>
        </Page>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawSquadList = await fetch(process.env.HOSTNAME + '/api/squads');
    let squadJson = await rawSquadList.json();
    return {props: {squads: squadJson}}
}