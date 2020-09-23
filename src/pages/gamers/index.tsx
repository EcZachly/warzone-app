import Head from 'next/head'
import { GetServerSideProps } from 'next'

export default function Gamers({gamers}) {

    return (
        <div className="container">
            <Head>
                <title>Gamers</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {gamers.map((gamer) => (
                    <li key={gamer.username + gamer.platform}>{gamer.username}</li>
                ))}
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch('http://localhost:3000/api/gamers');
    let gamerJson = await rawGamerList.json();
    return { props: { gamers:gamerJson } }
}