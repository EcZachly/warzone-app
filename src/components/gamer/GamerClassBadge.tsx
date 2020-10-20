import React from 'react';

import {Card, Badge} from '../SimpleComponents';

import {Gamer} from './GamerTypes';
import GamerService from './GamerService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerClassBadge(props: GamerClassBadgeProps) {
    let gamerClassConfig;
    let style = {color: undefined};

    try {
        gamerClassConfig = GamerService.getClassConfigurationByID(props.gamerClass);
    } catch (error) {
        gamerClassConfig = {};
        style.color = 'red';
        console.log('needs to be added: '  + props.gamerClass);
    }

    if (gamerClassConfig.needsUpdate) {
        style.color = 'blue';
    }

    return (
        <Badge size={'sm'} title={gamerClassConfig.description || props.gamerClass} style={style}>
            {gamerClassConfig.name || props.gamerClass}
        </Badge>
    );
}


type GamerClassBadgeProps = {
    gamerClass: string
}