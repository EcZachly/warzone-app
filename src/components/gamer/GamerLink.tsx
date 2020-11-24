import React from 'react';

import {Box, Image} from '../SimpleComponents';

import GamerPlatformImage from './GamerPlatformImage';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink(props: { gamer: Gamer, inline?: boolean }) {
    const {gamer, inline} = props;

    return (
        <Box style={{
            display: inline === true ? 'inline' : 'block',
            marginRight: inline === true ? '10px' : 'inherit'
        }}>
            <a href={'/gamer/' + encodeURIComponent(gamer.platform) + '/' + encodeURIComponent(gamer.username)}>
                {gamer.username}
            </a>

            <GamerPlatformImage gamer={gamer}/>
        </Box>
    );
}