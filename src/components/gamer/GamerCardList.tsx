import React from 'react';

import {Box} from './../SimpleComponents';

import GamerCard from './GamerCard';

import {GamerList} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerCardListProps = {
    gamers?: GamerList,
    onGamerClick?: (gamer) => void,
    mode?: null | 'condensed',
    classDescriptions?: Record<any, unknown>
};


export default function GamerCardList(props: GamerCardListProps) {
    return (
        <Box className={'gamer-card-list-container'}>
            {
                props.gamers.map((gamer) => {
                    return (
                        <GamerCard key={gamer.username + '-' + gamer.platform}
                                   onGamerClick={props.onGamerClick}
                                   mode={props.mode}
                                   classDescriptions={props.classDescriptions}
                                   gamer={gamer}/>
                    );
                })
            }
        </Box>
    );
}