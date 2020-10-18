import {GetServerSideProps} from 'next';
import SquadCard from '../../components/squad/SquadCard';
import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {getBaseUrlWithProtocol} from '../../services/UtilityService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Squads({squads, baseUrl, limit}) {
    const [feedHasMore, setFeedHasMore] = useState(true);
    const [squadValues, setSquads] = useState(squads);

    const fetchMoreSquads = async (page) => {
        const dataUrl = baseUrl + '/api/squad?limit=' + limit + '&offset=' + limit * page;

        const response = await fetch(dataUrl);
        const newSquads = await response.json();

        if (newSquads.length === 0) {
            setFeedHasMore(false);
        } else {
            const allGamers = [...squadValues, ...newSquads];
            setSquads(allGamers);
        }
    };

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
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);

    const rawSquadList = await fetch(baseUrl + '/api/squad');
    const squadJson = await rawSquadList.json();
    return {
        props: {
            squads: squadJson,
            limit: 10,
            baseUrl: baseUrl
        }
    };
};
