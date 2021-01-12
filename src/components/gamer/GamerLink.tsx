import React from 'react';

import {Badge, Show, Text} from '../SimpleComponents';
import {Placeholder} from './../SmartComponents';

import GamerPlatformImage from './GamerPlatformImage';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLink(props: { gamer: Gamer, single?: boolean, noLink?: boolean, loading?: boolean }) {
    const {gamer, single, noLink, loading} = props;

    let classNames = [
        'gamer-link-container',
        single === true ? 'single' : null
    ].filter((value) => !!value).join(' ');

    const isLoading = (loading === true);

    return (
        <Badge color={'dark'} size={'xl'} className={classNames}>
            <Show show={!isLoading}>
                {getUsername()}
                <GamerPlatformImage gamer={gamer} size={'sm'}/>
            </Show>

            <Show show={isLoading}>
                <Placeholder/>
            </Show>
        </Badge>
    );



    function getUsername() {
        console.log(gamer);
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