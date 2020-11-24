import React from 'react';

import {
    Card,
    CardBody,
    Small,
    CardHeader,
    Show,
    Box,
    TableHead,
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
    console.log(gamer);
    let aliases = gamer.aliases.filter((alias) => alias !== gamer.username);

    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);

    return (
        <Card style={{marginBottom: '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>

                <Show show={aliases.length > 0}>
                    <Small className="aliases">({aliases.join(',')})</Small>
                </Show>

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
