import React from 'react';
import {Box, Image } from '../SimpleComponents';
export default function GamerLink({gamer}) {
    return (
        <Box>
            <a href={"/gamer/" + encodeURIComponent(gamer.platform) + "/" + encodeURIComponent(gamer.username)}>{gamer.username}</a>
            <Image style={{width: '20px', height: '20px', marginLeft: '10px'}} src={"/images/platform/" + gamer.platform + ".png"} alt={"The platform for the user"}/>
        </Box>
    )
}