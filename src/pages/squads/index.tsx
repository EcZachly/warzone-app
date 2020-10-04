import {GetServerSideProps} from 'next'
import SquadCard from '../../components/squad/SquadCard';
import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import React, {useState} from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {getBaseUrlWithProtocol} from "../../services/UtilityService";

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Squads({squads, baseUrl, limit}) {
    let [feedHasMore, setFeedHasMore] = useState(true);
    let [squadValues, setSquads] = useState(squads);

    const fetchMoreSquads = async (page) => {
        let dataUrl = baseUrl + '/api/squads?limit=' + limit + "&offset=" + limit*page
        const response = await fetch(dataUrl);
        let newSquads =  await response.json();
        if(newSquads.length === 0){
            setFeedHasMore(false);
        }
        else{
            let allGamers = [...squadValues, ...newSquads];
            setSquads(allGamers);
        }
    }

    return (
        <Page title={'Squads'}>
            <Navbar/>

            <Container>
                <Main>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(page) => fetchMoreSquads(page)}
                        hasMore={feedHasMore}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                        useWindow={true}
                    >
                        {squadValues.map((squad, index) => <SquadCard key={squad.team_grain + index} squad={squad}/>)}
                    </InfiniteScroll>
                </Main>
            </Container>

            <Footer/>
        </Page>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let baseUrl = getBaseUrlWithProtocol(context.req);
    let rawSquadList = await fetch(baseUrl + '/api/squads');
    let squadJson = await rawSquadList.json();
    return {props: {squads: squadJson, limit: 10, baseUrl: baseUrl}}
}