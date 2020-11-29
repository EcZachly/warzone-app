import React from 'react';

import {Badge, Button, Text} from '../SimpleComponents';

import GamerPlatformImage from './GamerPlatformImage';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink(props: { gamer: Gamer, single?: boolean, noLink?: boolean }) {
    const {gamer, single, noLink} = props;

    let classNames = [
        'gamer-link-container',
        single === true ? 'single' : null
    ].filter((value) => !!value).join(' ');

    return (
        <Badge color={'dark'} size={'xl'} className={classNames}>
            {getUsername()}

            <GamerPlatformImage gamer={gamer} size={'sm'}/>
        </Badge>
    );



    function getUsername() {
        if (noLink === true) {
            return (
                <Text className={'username'}>{gamer.username}</Text>
            );
        } else {
            return (
                <a className={'username gamer-link'}
                   href={'/gamer/' + encodeURIComponent(gamer.platform) + '/' + encodeURIComponent(gamer.username)}>
                    {gamer.username}
                </a>
            );
        }
    }
}