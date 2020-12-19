import React, {useState} from 'react';

import {Box, Container} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerLink from './GamerLink';

import GamerCardList from './GamerCardList';
import {GamerList, Gamer} from './GamerTypes';
import {Input} from '../SmartComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerSearchInputProps = {
    size: 'xl' | 'lg' | 'md' | 'sm',
    baseUrl?: string,
    focus?: boolean,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}

export default function GamerSearchInput(props: GamerSearchInputProps) {
    let {size, baseUrl, focus} = props;
    const [gamerResults, setGamerResults] = useState([]);

    const gamerClickMethodExists = TypeService.isFunction(props.onGamerClick);


    const searchGamers = async (inputValue) => {
        if (inputValue && inputValue.length > 1) {
            const dataUrl = (baseUrl || '') + '/api/gamer?username.ilike=' + encodeURIComponent('%' + inputValue + '%');
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
                           mode={props.mode}
                           onGamerClick={props.onGamerClick}/>
        </Box>
    );
}