import {GetServerSideProps} from 'next';
import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import {Container, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';

import {getBaseUrlWithProtocol} from '../../services/UtilityService';

import {SquadCard} from '../../components/Squads';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function SquadCardList({squads, baseUrl, limit = 10, hasMore = false, classDescriptions = [], query = {}}) {
    const [feedHasMore, setFeedHasMore] = useState(hasMore);
    const [squadValues, setSquads] = useState(squads);

    const fetchMoreSquads = async (page) => {
        const dataUrl = baseUrl + '/api/squad?limit=' + limit + '&offset=' + limit * page;

        const response = await fetch(dataUrl);
        const newSquads = await response.json();

        if (newSquads.length === 0) {
            setFeedHasMore(false);
        } else {
            const allGamers = [...squadValues, ...newSquads['squads']];
            setSquads(allGamers);
        }
    };

    return (
        <InfiniteScroll pageStart={0}
                        loadMore={(page) => fetchMoreSquads(page)}
                        hasMore={feedHasMore}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                        useWindow={true}>

            {squadValues.map((squad, index) => {
                return (
                    <SquadCard key={squad.team_grain + index}
                               squad={squad}
                               classDescriptions={classDescriptions}/>
                );
            })}

        </InfiniteScroll>
    );
}