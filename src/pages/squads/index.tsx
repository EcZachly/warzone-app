import React, {useState} from 'react';
import {GetServerSideProps} from 'next';
import InfiniteScroll from 'react-infinite-scroller';

import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';

import {getBaseUrlWithProtocol} from '../../services/UtilityService';

import {SquadCard, SquadService} from './../../components/Squads';


//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Squads({squads, baseUrl, limit, classDescriptions}) {
    const [feedHasMore, setFeedHasMore] = useState(true);
    const [squadList, setSquadList] = useState(squads);


    return (
        <Page title={'Squads'}>
            <Navbar/>

            <Container>
                <Main>
                    <InfiniteScroll pageStart={0}
                                    loadMore={(page) => fetchMoreSquads(page)}
                                    hasMore={feedHasMore}
                                    loader={<div className="loader" key={0}>Loading ...</div>}
                                    useWindow={true}>

                        {squadList.map((squad, index) => <SquadCard key={squad.team_grain + index}
                                                                    squad={squad}
                                                                    classDescriptions={classDescriptions}/>)}

                    </InfiniteScroll>
                </Main>
            </Container>

            <Footer/>
        </Page>
    );



    async function fetchMoreSquads(page) {
        SquadService.querySquads({}, {
            baseUrl: baseUrl,
            limit: limit,
            offset: limit * page
        }).then((newSquadList) => {
            console.log(newSquadList);

            if (newSquadList.length > 0) {
                const combinedSquadList = [...squadList, ...newSquadList];
                setSquadList(combinedSquadList);
            } else {
                setFeedHasMore(false);
            }
        }).catch((error) => {
            console.log(error);
        });

        // const dataUrl = baseUrl + '/api/squad?limit=' + limit + '&offset=' + limit * page;
        //
        // const response = await fetch(dataUrl);
        // const jsonResponse = await response.json();
        //
        // const newSquadList = jsonResponse.squads;
        //
        // if (newSquadList.length === 0) {
        //     setFeedHasMore(false);
        // } else {
        //     const combinedSquadList = [...squadList, ...newSquadList];
        //     setSquadList(combinedSquadList);
        // }
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const rawSquadList = await fetch(baseUrl + '/api/squad');
    const squadJson = await rawSquadList.json();
    return {
        props: {
            squads: squadJson['squads'],
            classDescriptions: squadJson['classDescriptions'],
            limit: 10,
            baseUrl: baseUrl
        }
    };
};
