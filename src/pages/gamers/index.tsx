import Head from 'next/head'
import { GetServerSideProps } from 'next'
import GamerCard from '../../components/gamer/gamer_card';

export default function Gamers({gamers}) {

    return (
        <div className="container">
            <Head>
                <title>Gamers</title>
            </Head>
            <main>
                {gamers.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>)}
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch( process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return { props: { gamers:gamerJson } }
}