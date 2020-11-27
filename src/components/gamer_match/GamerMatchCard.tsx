import React from 'react';

import {
    Card,
    CardBody,
    Small,
    Header,
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

import {Gamer} from './../gamer/GamerTypes';
import {GamerMatch} from './GamerMatchTypes';
import UtilityService from '../../services/UtilityService';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerMatchCardProps = {
    gamer: Gamer,
    gamerMatch: GamerMatch
}


export default function GamerMatchCard({gamer, gamerMatch}: GamerMatchCardProps) {
    const kdr = UtilityService.numberToPercentage((gamerMatch.kills / gamerMatch.deaths), 2);
    const damageRatio = UtilityService.numberToPercentage(gamerMatch.damage_done / gamerMatch.damage_taken, 2);

    return (
        <Card className={'gamer-match-card'} style={{marginBottom: '10px'}}>

            <CardHeader>
                <Header size={'sm'}>Game {gamerMatch.match_id}</Header>
                <GamerLink gamer={gamer}/>
            </CardHeader>

            <CardBody>
                    <Box style={{display: 'flex', flexFlow: 'wrap'}}>
                        <Box className={'details main-details'}>
                            <LabelValue label={'Placement'} value={gamerMatch.team_placement}/>
                            <LabelValue label={'KDR (Kills / Deaths)'} value={`${kdr} (${gamerMatch.kills} / ${gamerMatch.deaths})`}/>
                            <LabelValue label={'Score'} value={UtilityService.numberWithCommas(gamerMatch.score)}/>
                            <LabelValue label={'Damage Ratio (Done / Taken)'} value={`${damageRatio} (${UtilityService.numberWithCommas(gamerMatch.damage_done)} / ${UtilityService.numberWithCommas(gamerMatch.damage_taken)})`}/>
                        </Box>

                        <Box className={'details support-details'} style={{height: 'auto', display: 'flex', alignContent: 'flex-start', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                            <LabelValue size={'sm'} label={'Game Duration'} value={getTimePlayedPretty()}/>
                            <LabelValue size={'sm'} label={'Assists'} value={gamerMatch.assists}/>
                            <LabelValue size={'sm'} label={'Gulag Deaths'} value={gamerMatch.gulag_deaths}/>
                            <LabelValue size={'sm'} label={'Gulag Kills'} value={gamerMatch.gulag_kills}/>
                            <LabelValue size={'sm'} label={'Longest Streak'} value={gamerMatch.longest_streak}/>
                            <LabelValue size={'sm'} label={'Headshots'} value={gamerMatch.headshots}/>
                            <LabelValue size={'sm'} label={'Caches Opened'} value={gamerMatch.objective.caches_open || 0}/>
                            <LabelValue size={'sm'} label={'Missions Started'} value={gamerMatch.objective.missions_started || 0}/>
                            <LabelValue size={'sm'} label={'Downed Enemies in First Circle'} value={gamerMatch.objective.down_enemy_circle_1 || 0}/>
                            <LabelValue size={'sm'} label={'Teams Wiped'} value={gamerMatch.objective.teams_wiped || 0}/>
                        </Box>
                    </Box>
            </CardBody>
        </Card>
    );


    function getTimePlayedPretty() {
        const timePlayed = gamerMatch.time_played;

        const minutesPlayed = Math.floor(timePlayed / 60);
        const secondsPlayed = timePlayed % 60;

        return [minutesPlayed, secondsPlayed].map((time  ) => {
            if (('' + time).length === 1) {
                return '0' + time;
            } else {
                return time;
            }
        }).join(':');
    }
}
