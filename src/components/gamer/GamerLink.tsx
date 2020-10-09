import React from 'react';

import {Box, Image } from '../SimpleComponents';

import GamerPlatformImage from './GamerPlatformImage';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink({gamer}) {
    return (
        <Box>
            <a href={'/gamer/' + encodeURIComponent(gamer.platform) + '/' + encodeURIComponent(gamer.username)}>{gamer.username}</a>
            <GamerPlatformImage gamer={gamer}/>
        </Box>
    );
}