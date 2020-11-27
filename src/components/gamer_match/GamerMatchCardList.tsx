import React from 'react';

import {Box} from './../SimpleComponents';

import GamerMatchCard from './GamerMatchCard';

import {Gamer} from './../gamer/GamerTypes';
import {GamerMatchList} from './GamerMatchTypes';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerMatchCardListProps = {
    gamer: Gamer,
    gamerMatchList: GamerMatchList
}


export default function GamerMatchCardList({gamer, gamerMatchList}: GamerMatchCardListProps) {
    return (
        <Box className={'gamer-match-list-container'}>
            {gamerMatchList.map((gamerMatch) => {
                return (
                    <GamerMatchCard gamer={gamer} gamerMatch={gamerMatch}/>
                );
            })}
        </Box>
    );
}
