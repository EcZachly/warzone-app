import React from 'react';
import {GAME_CATEGORIES} from '../../../lib/constants';
import {Option} from '../simple-components/InputSelect';
import {Input} from '../SmartComponents';

export function GamerCategorySelect({activeCategory, setCategory}) {
    const options = Object.entries(GAME_CATEGORIES).map((v) => {
        return {value: v[0], text: v[1]} as Option;
    });

    return (
        <Input type={'select'}
               onChange={(value) => {
                   setCategory(GAME_CATEGORIES[value]);
               }}
               label={'Game Mode'}
               options={options}
        />
    );
}