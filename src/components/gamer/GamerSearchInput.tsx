import React, {useState} from 'react';

import {Box} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerCardList from './GamerCardList';
import {Input} from '../SmartComponents';
import {GAME_CATEGORIES} from "../../../lib/constants";

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerSearchInputProps = {
    size: 'xl' | 'lg' | 'md' | 'sm',
    baseUrl?: string,
    focus?: boolean,
    gameCategory?: String,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}

export default function GamerSearchInput({size, baseUrl, focus, mode, gameCategory = GAME_CATEGORIES.ALL, onGamerClick = null}: GamerSearchInputProps) {
    const [gamerResults, setGamerResults] = useState([]);
    const gamerClickMethodExists = TypeService.isFunction(onGamerClick);
    const searchGamers = async (inputValue) => {
        if (inputValue && inputValue.length > 1) {
            const dataUrl = (baseUrl || '') + '/api/gamer?username.ilike=' + encodeURIComponent('%' + inputValue + '%') + '&game_category=' + gameCategory
            const response = await fetch(dataUrl);
            const newGamers = await response.json();
            setGamerResults(newGamers.gamers);
        } else {
            setGamerResults([]);
        }
    };



    return (
        <Box className={'gamer-search-container'}>
            <Input onChange={searchGamers}
                   placeholder={'Search Gamers'}
                   mode={'plain'}
                   focus={focus === true}
                   inputStyle={{borderRadius: 0, borderBottom: '1px solid #888'}}
                   size={size}/>

            <GamerCardList gamers={gamerResults}
                           mode={mode}
                           onGamerClick={onGamerClick}/>
        </Box>
    );
}