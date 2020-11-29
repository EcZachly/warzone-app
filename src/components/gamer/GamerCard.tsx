import React from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    Box
} from '../SimpleComponents';

import {LabelValue} from './../SmartComponents';

import {GamerLinkList, GamerAliasList, GamerHeat} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object
}


export default function GamerCard({gamer, classDescriptions}: GamerCardProps) {
    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);


    return (
        <Card className={'gamer-card'}>

            <CardHeader>

                <GamerLinkList gamer={gamer}/>

                <GamerAliasList gamer={gamer}/>

                <GamerHeat gamer={gamer}/>

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
