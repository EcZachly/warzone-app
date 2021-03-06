import React from 'react';
import moment from 'moment';

import {Box, Card, CardBody, CardHeader, Header, Image, Show, Small, Text} from '../SimpleComponents';

import {LabelValue} from './../SmartComponents';

import {GamerLinkList} from './../gamer/index';

import {Gamer} from './../gamer/GamerTypes';
import {GamerMatch} from './GamerMatchTypes';

import PlacementIndicator from './PlacementIndicator';
import UtilityService from '../../services/UtilityService';
import {COLORS} from '../../config/CONSTANTS';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerMatchCardProps = {
    gamer: Gamer,
    gamerMatch: GamerMatch,
    noLink?: boolean
}


export default function GamerMatchCard({gamer, noLink, gamerMatch}: GamerMatchCardProps) {
    console.log('gamerMatch', gamerMatch);

    const kdr = UtilityService.round((gamerMatch.kills / (gamerMatch.deaths || 1)), 2);
    const damageRatio = UtilityService.round((gamerMatch.damage_done / gamerMatch.damage_taken) || 0, 2);

    const startTimestamp = moment(gamerMatch.start_timestamp);
    const startTimestampPretty = startTimestamp.format('LLL');

    const endTimestamp = moment(gamerMatch.end_timestamp);
    const endTimestampPretty = endTimestamp.format('LT');

    const gameDurationPretty = calculatePrettyDuration(startTimestamp, endTimestamp);
    const timeDifferencePretty = calculatePrettyDuration(endTimestamp, moment());

    const placementPercentage = gamerMatch.team_placement / gamerMatch.team_count;
    const teamWon = (gamerMatch.team_placement === 1);
    const topTenPercent = teamWon === false && placementPercentage <= .10;

    return (
        <Card className={'gamer-match-card match-' + (teamWon ? 'won' : (topTenPercent) ? 'top-10' : 'lost')}
              style={{marginBottom: '10px'}}>

            <CardHeader>
                <Header size={'sm'}>
                    {startTimestampPretty} - {endTimestampPretty}
                    <Show show={!!timeDifferencePretty}>
                        <Small style={{fontStyle: 'italic', color: '#AAAAAA', marginLeft: '5px'}}>
                            (ended {timeDifferencePretty} ago)
                        </Small>
                    </Show>
                </Header>

                <GamerLinkList gamer={gamer} noLink={noLink}/>
            </CardHeader>

            <CardBody>
                <Box style={{display: 'flex', flexFlow: 'wrap'}}>
                    <Box className={'details main-details'}>
                        <LabelValue label={'Game Type'}
                                    value={UtilityService.camelToProperCase(gamerMatch.team_type) + 's'}/>

                        <LabelValue label={'Placement'}
                                    value={
                                        <PlacementIndicator placement={gamerMatch.team_placement}
                                                            teamCount={gamerMatch.team_count}/>
                                    }/>

                        <LabelValue label={'KDR (Kills / Deaths)'}
                                    value={
                                        <>
                                            {kdr} <Small>
                                                ({gamerMatch.kills} / {gamerMatch.deaths})
                                        </Small>
                                        </>
                                    }/>

                        <LabelValue label={'Score'}
                                    value={
                                        <>
                                            {UtilityService.numberWithCommas(gamerMatch.score)} <Small>
                                                ({UtilityService.round(gamerMatch.score / getMinutesPlayed(), 0)} / minute)
                                            </Small>
                                        </>
                                    }/>

                        <LabelValue label={'Damage Ratio (Done / Taken)'}
                                    value={
                                        <>
                                            {damageRatio} <Small>
                                            ({UtilityService.numberWithCommas(gamerMatch.damage_done)} / {UtilityService.numberWithCommas(gamerMatch.damage_taken)})
                                        </Small>
                                        </>
                                    }/>
                    </Box>

                    <Box className={'details support-details'}>

                        <LabelValue size={'sm'} label={'Time Played'} value={getTimePlayedPretty()}/>

                        <LabelValue size={'sm'} label={'Assists'} value={gamerMatch.assists}/>

                        <LabelValue size={'sm'} label={'Gulag Deaths'} value={gamerMatch.gulag_deaths}/>

                        <LabelValue size={'sm'} label={'Gulag Kills'} value={gamerMatch.gulag_kills}/>

                        <LabelValue size={'sm'} label={'Longest Streak'} value={gamerMatch.longest_streak}/>

                        <LabelValue size={'sm'} label={'Headshots'} value={gamerMatch.headshots}/>

                        <LabelValue size={'sm'} label={'Caches Opened'} value={gamerMatch.objective.caches_open || 0}/>

                        <LabelValue size={'sm'} label={'Missions Started'}
                                    value={gamerMatch.objective.missions_started || 0}/>

                        <LabelValue size={'sm'} label={'Downed Enemies in First Circle'}
                                    value={gamerMatch.objective.down_enemy_circle_1 || 0}/>

                        <LabelValue size={'sm'} label={'Teams Wiped'} value={gamerMatch.objective.teams_wiped || 0}/>
                    </Box>

                    <Show show={true}>
                        <Box>
                            <a href={'https://www.sbmmwarzone.com/lobby/' + gamerMatch.match_id}>
                                View match details on sbmmwarzone.com
                            </a>
                        </Box>
                    </Show>
                </Box>
            </CardBody>
        </Card>
    );


    function getMinutesPlayed() {
        return gamerMatch.time_played / 60;
    }


    function getTimePlayedPretty() {
        const timePlayed = gamerMatch.time_played;

        const minutesPlayed = Math.floor(getMinutesPlayed());
        const secondsPlayed = timePlayed % 60;

        return [minutesPlayed, secondsPlayed].map((time) => {
            if (('' + time).length === 1) {
                return '0' + time;
            } else {
                return time;
            }
        }).join(':');
    }


    function calculatePrettyDuration(startTimestamp, endTimestamp) {
        let timeDifferencePretty = '';

        const MAX_DIFFERENCE_TO_DISPLAY_DIFFERENCE = 24 * 60;//hours
        let timeDifference = endTimestamp.diff(startTimestamp, 'minute');

        if (timeDifference < MAX_DIFFERENCE_TO_DISPLAY_DIFFERENCE) {
            const USE_MINUTES_THRESHOLD = 120;
            const useMinutes = timeDifference < USE_MINUTES_THRESHOLD;

            if (useMinutes === false) {
                timeDifference = Math.floor(timeDifference / 60);
            }

            const sQualifier = timeDifference === 1 ? '' : 's';
            const type = useMinutes ? 'minute' : 'hour';

            timeDifferencePretty = timeDifference + ' ' + type + sQualifier;
        }

        return timeDifferencePretty;
    }
}
