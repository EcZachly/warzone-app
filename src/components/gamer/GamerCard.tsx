import React from 'react';

import {
    Card,
    CardBody,
    Button,
    Show,
    CardHeader,
    Box
} from '../SimpleComponents';

import {LabelValue} from './../SmartComponents';

import {GamerLinkList, GamerAliasList, GamerHeat} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';
import {UserService} from '../Users';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}


export default function GamerCard({gamer, classDescriptions, mode, onGamerClick}: GamerCardProps) {
    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);

    const isCondensed = mode === 'condensed';
    const modeClass = isCondensed ? 'condensed' : 'standard';

    const noLink = !!onGamerClick;
    const cardClickable = !!noLink;

    // const userIsLoggedIn = UserService.userIsLoggedIn();

    if (isCondensed) {
        return getCondensedCard();
    } else {
        return (
            <Card className={'gamer-card ' + modeClass}>

                <CardHeader>

                    <Box style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                        <Box style={{width: '85%'}}>
                            <GamerLinkList gamer={gamer} noLink={noLink}/>
                        </Box>

                        <Box style={{width: '10%'}}>
                            {/*{getCardOptions()}*/}
                        </Box>
                    </Box>

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

                        <LabelValue label={'Gulag Win Rate'}
                                    value={gamer.gulag_win_rate}/>

                    </Box>

                </CardBody>
            </Card>
        );
    }



    function getCondensedCard() {
        return (
            <Card className={'gamer-card ' + modeClass} onClick={onGamerClick && function () {
                onGamerClick(gamer);
            }}>
                <CardHeader>
                    <GamerLinkList gamer={gamer} noLink={noLink}/>

                    <GamerAliasList gamer={gamer}/>
                </CardHeader>

                <CardBody style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <Box className={'details'} style={{paddingTop: '5px'}}>

                        <LabelValue size={'sm'} label={'KDR'} value={gamer.kdr}/>

                        <LabelValue size={'sm'} label={'Max Kills'} value={gamer.max_kills}/>

                        <LabelValue size={'sm'} label={'Overall Win Rate'} value={overallWinRate}/>

                        <LabelValue size={'sm'} label={'Total Games'} value={gamesPlayed}/>

                        <LabelValue size={'sm'} label={'Gulag Win Rate'}
                                    value={gamer.gulag_win_rate}/>

                    </Box>
                </CardBody>
            </Card>
        );
    }
}
