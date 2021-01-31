import React from 'react';

import {Box, Show, Small} from './../SimpleComponents';

import {Gamer} from './GamerTypes';
import UtilityService from '../../services/UtilityService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerAliasList(props: { gamer: Gamer }) {
    const {gamer} = props;

    const aliases = UtilityService.validateItem(gamer.aliases, 'array', []).filter((alias) => alias !== gamer.username);
    const showAliases = aliases.length > 0;

    return (
        <Show show={showAliases}>
            <Box className={'gamer-alias-list-container'}>
                <Small title={'aliases'} className="aliases">{aliases.join(', ')}</Small>
            </Box>
        </Show>
    );
}