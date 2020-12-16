import React from 'react';

import {
    Card,
    CardBody,
    Button,
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
    classDescriptions?: object
}


export default function GamerCard({gamer, classDescriptions}: GamerCardProps) {
    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);

    // const userIsLoggedIn = UserService.userIsLoggedIn();


    return (
        <Card className={'gamer-card'}>

            <CardHeader>

                <Box style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                    <Box style={{width: '85%'}}>
                        <GamerLinkList gamer={gamer}/>
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

                    <LabelValue label={'Gulag Win Rate'} value={gamer.gulag_win_rate}/>

                </Box>

            </CardBody>
        </Card>
    );


    // function getCardOptions() {
    //     if (userIsLoggedIn) {
    //         return (
    //             <>
    //                 <Button type={'link'}
    //                         onClick={() => {
    //
    //                         }}>
    //                 &#8230;
    //             </Button>
    //             </>
    //         );
    //     }
    // }
}
