import React from 'react';

import {Box} from './../SimpleComponents';

import GamerMatchCard from './GamerMatchCard';

import {Gamer} from './../gamer/GamerTypes';
import {GamerMatchList} from './GamerMatchTypes';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerMatchCardListProps = {
    gamer: Gamer,
    gamerMatchList: GamerMatchList,
    noLink?: boolean
}


export default function GamerMatchCardList({gamer, noLink, gamerMatchList}: GamerMatchCardListProps) {
    return (
        <Box className={'gamer-match-list-container'}>
            {gamerMatchList.map((gamerMatch) => {
                return (
                    <GamerMatchCard gamer={gamer} gamerMatch={gamerMatch} noLink={noLink}/>
                );
            })}
        </Box>
    );
}
