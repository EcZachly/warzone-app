import React from 'react';
import moment from 'moment';

import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Text,
    Header,
    Show,
    Small,
    Table,
    Image,
    TableBody,
    TableData,
    TableHead,
    TableHeader,
    TableRow
} from '../SimpleComponents';

import {LabelValue} from './../SmartComponents';

import {GamerLinkList, GamerService} from './../gamer/index';

import {Match} from './MatchTypes';

import UtilityService from '../../services/UtilityService';

import {COLORS} from '../../config/CONSTANTS';
import PlacementIndicator from '../gamer_match/PlacementIndicator';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type MatchCardProps = {
    match: Match,
}


export default function MatchCard({match}: MatchCardProps) {
    const gamers = UtilityService.validateItem(match.gamers, 'array', []);
    const firstGamer = gamers[0];

    const startTimestamp = moment(match.start_timestamp);
    const startTimestampPretty = startTimestamp.format('LLL');

    const endTimestamp = moment(match.end_timestamp);
    const endTimestampPretty = endTimestamp.format('LT');

    const gameDurationPretty = calculatePrettyDuration(startTimestamp, endTimestamp);
    const timeDifferencePretty = calculatePrettyDuration(endTimestamp, moment());


    const placementPercentage = firstGamer.team_placement / match.team_count;
    const teamWon = (firstGamer.team_placement === 1);
    const topTenPercent = teamWon === false && placementPercentage <= .10;

    return (
        <Card className={'match-card match-' + (teamWon ? 'won' : (topTenPercent) ? 'top-10' : 'lost')} style={{marginBottom: '10px'}}>

            <CardHeader>
                <Header size={'sm'}>
                    {startTimestampPretty} - {endTimestampPretty}
                    <Show show={!!timeDifferencePretty}>
                        <Small style={{fontStyle: 'italic', color: '#AAAAAA', marginLeft: '5px'}}>
                            (ended {timeDifferencePretty} ago)
                        </Small>
                    </Show>
                </Header>

                <GamerLinkList gamers={gamers}/>
            </CardHeader>

            <CardBody>
                <Box style={{display: 'flex', flexFlow: 'wrap', width: '100%'}}>
                    <Box className={'details main-details'}>
                        <LabelValue label={'Game Type'}
                                    value={UtilityService.camelToProperCase(match.team_type) + 's'}/>

                        <LabelValue label={'Placement'}
                                    value={(
                                        <PlacementIndicator placement={firstGamer.team_placement}
                                                            teamCount={match.team_count}/>
                                    )}/>
                    </Box>

                    <Box className={'details support-details'}>
                        {generateGamerComparisonTable()}
                    </Box>
                </Box>
            </CardBody>
        </Card>
    );



    function generateGamerComparisonTable() {
        return (
            <Table small striped responsive={gamers.length > 2}>
                <TableHead>
                    <TableRow>
                        <TableHeader/>
                        {
                            gamers.map((gamerMatch) => {
                                return (
                                    <TableHeader>
                                        <Text title={gamerMatch.username}>
                                            {GamerService.minifyUsername(gamerMatch.username)}
                                        </Text>
                                    </TableHeader>
                                );
                            })
                        }
                    </TableRow>

                </TableHead>
                <TableBody>
                    {generateTableRows()}
                </TableBody>
            </Table>
        );
    }



    function generateTableRows() {
        return [
            {
                key: 'KDR (Kills, Deaths, Assists)',
                render: (gamerMatch) => {
                    return (
                        <>
                        <Text>
                            {UtilityService.round(gamerMatch.kills / (gamerMatch.deaths || 1), 2)}
                        </Text> <Small>
                                ({gamerMatch.kills} / {gamerMatch.deaths} / {gamerMatch.assists})
                        </Small>
                    </>
                    );
                }
            }, {
                key: 'Score',
                render: (gamerMatch) => {
                    return (
                        <>
                            <Text>
                                {UtilityService.numberWithCommas(gamerMatch.score)}
                            </Text> <Small>
                            ({UtilityService.round(gamerMatch.score / getMinutesPlayed(gamerMatch), 0)} / minute)
                        </Small>
                    </>
                    );
                }
            }, {
                key: 'Damage Ratio (Dealt / Taken)',
                render: (gamerMatch) => {
                    return (
                        <>
                            <Text>
                                {UtilityService.round((gamerMatch.damage_done / (gamerMatch.damage_taken || 100)) || 0, 2)}
                            </Text> <Small>
                                ({UtilityService.numberWithCommas(gamerMatch.damage_done)} / {UtilityService.numberWithCommas(gamerMatch.damage_taken)})
                            </Small>
                        </>
                    );
                }
            }
        ].map((tableConfig) => {
            return (
                <TableRow>
                    <TableData>
                        <Small>
                            {tableConfig.key}
                        </Small>
                    </TableData>
                    {
                        gamers.map((gamerMatch) => {
                            return (
                                <TableData>
                                    {tableConfig.render(gamerMatch)}
                                </TableData>
                            );
                        })
                    }
                </TableRow>
            );
        });
    }


    function getMinutesPlayed(gamerMatch) {
        return gamerMatch.time_played / 60;
    }


    // function getTimePlayedPretty() {
    //     const timePlayed = match.time_played;
    //
    //     const minutesPlayed = Math.floor(getMinutesPlayed());
    //     const secondsPlayed = timePlayed % 60;
    //
    //     return [minutesPlayed, secondsPlayed].map((time) => {
    //         if (('' + time).length === 1) {
    //             return '0' + time;
    //         } else {
    //             return time;
    //         }
    //     }).join(':');
    // }


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
