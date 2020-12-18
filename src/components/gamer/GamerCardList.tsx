import React from 'react';

import {Box} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerCard from './GamerCard';

import {GamerList, Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerCardList(props: { gamers?: GamerList, gamer?: Gamer, block?: boolean, noLink?: boolean }) {
    let {gamers} = props;

    return (
        <Box className={'gamer-card-list-container'}>
            {
                gamers.map((gamer) => {
                    return (
                        <GamerCard key={gamer.username + '-' + gamer.platform}
                                   gamer={gamer}/>
                    );
                })
            }
        </Box>
    );
}