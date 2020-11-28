import React from 'react';

import {Box, Text} from '../SimpleComponents';

import GamerPlatformImage from './GamerPlatformImage';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink(props: { gamer: Gamer, inline?: boolean, noLink?: boolean }) {
    const {gamer, inline, noLink} = props;



    return (
        <Box className={'gamer-link-container'} style={{
            display: inline === true ? 'inline' : 'block',
            marginRight: inline === true ? '10px' : 'inherit'
        }}>
            {getUsername()}
            <GamerPlatformImage gamer={gamer}/>
        </Box>
    );



    function getUsername() {
        if (noLink === true) {
            return (
                <Text>
                    {gamer.username}
                </Text>
            );
        } else {
            return (
                <a className={'gamer-link'}
                   href={'/gamer/' + encodeURIComponent(gamer.platform) + '/' + encodeURIComponent(gamer.username)}>
                    {gamer.username}
                </a>
            );
        }
    }
}