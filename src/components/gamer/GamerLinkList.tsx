import React from 'react';

import {Box} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerLink from './GamerLink';

import {Gamer, GamerList} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerLinkList(props: { gamers?: GamerList, gamer?: Gamer, loading?: boolean, block?: boolean, noLink?: boolean }) {
    let {gamers, gamer, block, loading, noLink} = props;

    if (TypeService.isArray(gamers) === false && TypeService.isObject(gamer)) {
        gamers = [gamer];
    }

    if (TypeService.isArray(gamers) === false) {
        if (loading === true) {
            gamers = [{username: 'test', platform: 'xbl', uno_id: 11111111}];
        } else {
            throw new Error('props.gamers (GamerList) OR props.gamer (Gamer) is required');
        }
    }

    if (block === true) {
        return (
            <>
                {
                    gamers.map((gamer) => {
                        const key = [gamer.platform, gamer.username].join('-');

                        return (<GamerLinkList key={key} gamer={gamer} noLink={noLink} loading={loading} block={false}/>);
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
                                       loading={loading}
                                       gamer={gamer}
                                       noLink={noLink}/>
                        );
                    })
                }
            </Box>
        );
    }
}