import React from 'react';

import {
    Card,
    CardBody,
    Small,
    CardHeader,
    Show,
    Box,
    Image,
    LineBreak,
    Text,
    Table,
    TableBody,
    TableData,
    TableHeader,
    Badge
} from '../SimpleComponents';

import {LabelValue} from './../SmartComponents';

import {GamerLinkList, GamerAliasList} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object
}


export default function GamerHeat({gamer}: GamerCardProps) {
    let heatFlames = <div/>;
    
    if (gamer.heat_rating > 0) {
        let delta = (gamer.last_10_rolling_average_kdr / gamer.last_100_rolling_average_kdr - 1) * 100;

        if (delta >= 0.1) {
            let cnt = 0;
            let array = [];

            while (cnt < gamer.heat_rating) {
                array.push(<Image className={'heat-indicator'}
                                  style={{width: '16px', height: '18px', opacity: (52 + (cnt * 12)) + '%'}}
                                  src={'/assets/images/icons/heat-sm.png'}
                                  alt={'number of flames means this player is on a hot streak'}/>);
                cnt = cnt + 1;
            }

            let viewDelta = delta.toFixed(1) + '%';

            heatFlames = (
                <Box className={'heat-container'}>
                    <Box className={'heat-scores'}>
                        {array}
                    </Box>

                    <Small className={'details'}>
                        KDR <Text className={'percentage'}>+{viewDelta}</Text> better than usual
                    </Small>
                </Box>
            );
        }
    }

    const showHeatScore = gamer.heat_rating > 0;

    return (
        <Show show={showHeatScore}>
            {heatFlames}
        </Show>
    );
}
