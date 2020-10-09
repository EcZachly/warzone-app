import React from 'react';

import {Box, Image} from '../SimpleComponents';

import GamerPlatformImage from './GamerPlatformImage';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink(props: { gamer: Gamer }) {
    const gamer = props.gamer;

    return (
        <Box>
            <a href={'/gamer/' + encodeURIComponent(gamer.platform) + '/' + encodeURIComponent(gamer.username)}>
                {gamer.username}
            </a>

            <GamerPlatformImage gamer={gamer}/>
        </Box>
    );
}