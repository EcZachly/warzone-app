import React from 'react';

import {Box} from './../SimpleComponents';

import MatchCard from './MatchCard';

import {MatchList} from './MatchTypes';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type MatchCardListProps = {
    matches: MatchList,
}


export default function MatchCardList({matches}: MatchCardListProps) {
    return (
        <Box className={'match-list-container'}>
            {matches.map((match) => {
                return (
                    <MatchCard key={match.match_id}
                               match={match}/>
                );
            })}
        </Box>
    );
}
