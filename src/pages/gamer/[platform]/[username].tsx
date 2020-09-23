import Head from 'next/head'
import {GetServerSideProps} from 'next'

export default function Gamers({gamerData}) {
    let {gamer, viewData, message} = gamerData;
    if (message) {
        return (
            <div className="container">
                <main>
                    <h1>{message}</h1>
                </main>
            </div>
        )
    }
    else{
        return (
            <div className="container">
                <Head>
                    <title>Gamers</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <main>
                    <h1>{gamer.username}</h1>
                    <h1>{gamer.platform}</h1>
                </main>
            </div>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let {username, platform} = context.query;
    let view = context.query.view || 'teammate_analysis';
    let rawGamerList = await fetch('http://localhost:3000/api/gamer/' + platform + '/' + username + '?view=' + view);
    let gamerJson = await rawGamerList.json();
    return {props: {gamerData: gamerJson, view: view}}
}
