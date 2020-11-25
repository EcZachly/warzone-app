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

import {GamerLink} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';



//===---==--=-=--==---===----===---==--=-=--==---===----//

//TODO CREATE Gamer type and enforce it here
export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object
}


export default function GamerCard({gamer, classDescriptions}: GamerCardProps) {
    let aliases = gamer.aliases.filter((alias) => alias !== gamer.username);

    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);

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
    const showAliases = aliases.length > 0;

    return (
        <Card className={'gamer-card'} style={{marginBottom: '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>

                <Show show={showAliases}>
                    <Small title={'aliases'} className="aliases">{aliases.join(', ')}</Small>
                </Show>

                <Show show={showHeatScore}>
                    {heatFlames}
                </Show>

                <ClassBadgeList subject={gamer as object}
                                classDescriptions={classDescriptions}/>

            </CardHeader>

            <CardBody>

                <Box className={'details'}>
                    <LabelValue label={'KDR'} value={gamer.kdr}/>

                    <LabelValue label={'Max Kills'} value={gamer.max_kills}/>

                    <LabelValue label={'Overall Win Rate'} value={overallWinRate}/>

                    <LabelValue label={'Total Games'} value={gamesPlayed}/>

                    <LabelValue label={'Gulag Win Rate'} value={gamer.gulag_win_rate}/>
                </Box>

            </CardBody>
        </Card>
    );
}
