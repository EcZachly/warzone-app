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
        let cnt = 0;
        let array = [];

        while (cnt < gamer.heat_rating) {
            array.push(<Image style={{width: '25px', height: '25px'}} src={'/assets/images/flame.jpeg'}
                              alt={'number of flames means this player is on a hot streak'}/>);
            cnt = cnt + 1;
        }

        let delta = (gamer.last_10_rolling_average_kdr / gamer.last_100_rolling_average_kdr - 1) * 100;

        let viewDelta = delta.toFixed(1) + '%';

        heatFlames = (
            <Box>
                <Box style={{float: 'left'}}>{array}</Box>
                <Box style={{marginLeft: '10px', float: 'left'}}>
                    KDR <Text bold style={{color: 'green'}}>+{viewDelta}</Text> better than usual
                </Box>
            </Box>
        );
    }


    return (
        <Card style={{marginBottom: '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>

                <Show show={aliases.length > 0}>
                    <Small className="aliases">({aliases.join(',')})</Small>
                </Show>

                <Show show={gamer.heat_rating > 0}>
                    {heatFlames}
                </Show>

                <LineBreak clear/>

                <ClassBadgeList subject={gamer as object}
                                classDescriptions={classDescriptions}/>

            </CardHeader>

            <CardBody>

                <Box style={{display: 'flex'}}>
                    <LabelValue style={{marginRight: '50px'}} label={'KDR'} value={gamer.kdr}/>

                    <LabelValue style={{marginRight: '50px'}} label={'Max Kills'} value={gamer.max_kills}/>

                    <LabelValue style={{marginRight: '50px'}} label={'Overall Win Rate'} value={overallWinRate}/>

                    <LabelValue style={{marginRight: '50px'}} label={'Total Games'} value={gamesPlayed}/>

                    <LabelValue style={{marginRight: '50px'}} label={'Gulag Win Rate'} value={gamer.gulag_win_rate}/>
                </Box>

            </CardBody>
        </Card>
    );
}
