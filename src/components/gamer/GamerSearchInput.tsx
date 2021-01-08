import React, {useRef, useState} from 'react';

import {Box, Show, Text} from './../SimpleComponents';

import TypeService from '../../services/TypeService';

import GamerCardList from './GamerCardList';
import {Input} from '../SmartComponents';
import {Loading} from './../AppComponents';
import {GAME_CATEGORIES} from '../../../lib/constants';
import _ from 'lodash';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerSearchInputProps = {
    size: 'xl' | 'lg' | 'md' | 'sm',
    baseUrl?: string,
    focus?: boolean,
    gameCategory?: String,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}

export default function GamerSearchInput(props: GamerSearchInputProps) {
    const {size, baseUrl, focus, mode, gameCategory = GAME_CATEGORIES.ALL, onGamerClick} = props;

    const [gamerResults, setGamerResults] = useState([]);
    const [searchHasBeenInitiated, setSearchHasBeenInitiated] = useState(false);
    const [loading, setLoading] = useState(false);

    const searchGamers = async (inputValue) => {
        if (inputValue && inputValue.length > 1) {
            if (searchHasBeenInitiated !== true) {
                setSearchHasBeenInitiated(true);
            }

            setLoading(true);

            const dataUrl = (baseUrl || '') + '/api/gamer?username.ilike=' + encodeURIComponent('%' + inputValue + '%') + '&game_category=' + gameCategory;
            const response = await fetch(dataUrl);
            const newGamers = await response.json();
            setGamerResults(newGamers.gamers);
            setLoading(false);
        } else {
            setLoading(false);
            setSearchHasBeenInitiated(false);
            setGamerResults([]);
        }
    };



    const debouncedSearchGamers = useRef(_.debounce((input) => {
        setLoading(true);
        return searchGamers(input)
    }, 500)).current;



    return (
        <Box className={'gamer-search-container'}>
            <Input onChange={debouncedSearchGamers}
                   placeholder={'Search Gamers'}
                   mode={'plain'}
                   focus={focus === true}
                   inputStyle={{borderRadius: 0, borderBottom: '1px solid #888'}}
                   size={size}/>


            <Show show={loading === false && searchHasBeenInitiated}>
                <Show show={gamerResults.length > 0}>
                    <GamerCardList gamers={gamerResults}
                                   mode={mode}
                                   onGamerClick={onGamerClick}/>
                </Show>

                <Show show={gamerResults.length === 0}>
                    <Text type={'help'}>No Gamers Found</Text>
                </Show>
            </Show>


            <Show show={loading === true}>
                <Loading/>
            </Show>
        </Box>
    );
}