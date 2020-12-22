import React from 'react';

import {
    Card,
    CardBody,
    Text,
    Small,
    Show,
    CardHeader,
    Box, Paragraph
} from '../SimpleComponents';

import {LabelValue, Placeholder} from './../SmartComponents';

import {GamerLinkList, GamerAliasList, GamerHeat} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';
import UtilityService from '../../services/UtilityService';
import {UserService} from '../Users';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer?: Gamer,
    classDescriptions?: object,
    loading?: boolean,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}


export default function GamerCard({gamer, classDescriptions, mode, loading, onGamerClick}: GamerCardProps) {
    const isLoading = (loading === true);



    if (isLoading === true) {
        return getLoadingCard();
    } else {
        if (!gamer) {
            return <Card/>;
        }

        const isCondensed = mode === 'condensed';
        const modeClass = isCondensed ? 'condensed' : 'standard';

        const noLink = !!onGamerClick;

        let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
        let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills));
        let gamesPlayedIsMoreThan1000 = gamesPlayed >= 1000;

        let gamesPlayedText = (gamesPlayedIsMoreThan1000) ? '1,000+' : UtilityService.numberWithCommas(UtilityService.round(gamesPlayed, 0));

        const cardClickable = !!noLink;

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

                            <LabelValue label={(<Text title={'including kills and deaths in gulag'}>KDR <Small>(last 100)</Small></Text>)}
                                        value={UtilityService.round(gamer.last_100_rolling_average_kdr, 2)}/>

                            <LabelValue label={'Max Kills'}
                                        labelTitle={'Including kills in gulag'}
                                        value={gamer.max_kills}/>

                            <LabelValue label={'Overall Win Rate'}
                                        value={overallWinRate}/>

                            <LabelValue label={(<Text>Gulag Win Rate <Small>(KDR)</Small></Text>)}
                                        value={(
                                            <Text>{gamer.pretty_gulag_win_rate} <Small>({gamer.gulag_kdr})</Small></Text>
                                        )}/>

                            <LabelValue size={'sm'}
                                        labelTitle={'Including kills in gulag'}
                                        label={'Average Kills per Game'}
                                        value={`${UtilityService.round(gamer.avg_kills, 1)}`}/>

                            <LabelValue size={'sm'}
                                        label={'Total Games'}
                                        value={gamesPlayedText}/>
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


    function getLoadingCard() {
        return (
            <Card className={'gamer-card loading'}>
                <CardHeader>
                    <Placeholder block/>
                </CardHeader>

                <CardBody>
                    <Placeholder block style={{width: '100%'}}/>
                </CardBody>
            </Card>
        );
    }
}
