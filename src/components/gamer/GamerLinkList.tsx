import React from 'react';

import {Box} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerLink from './GamerLink';

import {GamerList, Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLinkList(props: { gamers?: GamerList, gamer?: Gamer, block?: boolean, noLink?: boolean }) {
    let {gamers, gamer, block, noLink} = props;

    if (TypeService.isArray(gamers) === false && TypeService.isObject(gamer)) {
        gamers = [gamer];
    }

    if (TypeService.isArray(gamers) === false) {
        throw new Error('props.gamers (GamerList) OR props.gamer (Gamer) is required');
    }

    if (block === true) {
        return (
            <>
                {
                    gamers.map((gamer) => {
                        let key = [gamer.platform, gamer.username].join('-');

                        return (<GamerLinkList key={key} gamer={gamer} noLink={noLink} block={false}/>);
                    })
                }
            </>
        );
    } else {
        return (
            <Box className={'gamer-link-list-container'}>
                {
                    gamers.map((gamer) => {
                        return (
                            <GamerLink key={gamer.username}
                                       gamer={gamer}
                                       noLink={noLink}/>
                        );
                    })
                }
            </Box>
        );
    }
}