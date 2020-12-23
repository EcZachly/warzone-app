import React from 'react';
import moment from 'moment';

import {
    Card,
    CardBody,
    Small,
    Header,
    CardHeader,
    Show,
    Box,
    TableRow,
    TableHead,
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

import {GamerLinkList} from './../gamer/index';

import {Match} from './MatchTypes';

import UtilityService from '../../services/UtilityService';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export type MatchCardProps = {
    match: Match,
}


export default function MatchCard({match}: MatchCardProps) {
    const gamers = UtilityService.validateItem(match.gamers, 'array', []);
    const firstGamer = gamers[0];

    const startTimestamp = moment(match.start_timestamp);
    let startTimestampPretty = startTimestamp.format('LLL');

    let endTimestamp = moment(match.end_timestamp);
    let endTimestampPretty = endTimestamp.format('LT');

    const gameDurationPretty = calculatePrettyDuration(startTimestamp, endTimestamp);
    const timeDifferencePretty = calculatePrettyDuration(endTimestamp, moment());

    let placementPercentage = 'Top ' + UtilityService.numberToPercentage(firstGamer.team_placement / match.team_count, 0);

    return (
        <Card className={'match-card'} style={{marginBottom: '10px'}}>

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
                                        <>
                                            {firstGamer.team_placement} of {match.team_count} <Small>
                                                ({placementPercentage})
                                        </Small>
                                        </>
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
                                    <TableHeader>{gamerMatch.username}</TableHeader>
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
                        {UtilityService.round(gamerMatch.kills / (gamerMatch.deaths || 1), 2)} <Small>
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
                        {UtilityService.numberWithCommas(gamerMatch.score)} <Small>
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
                            {UtilityService.round((gamerMatch.damage_done / (gamerMatch.damage_taken || 100)) || 0, 2)} <Small>
                                ({UtilityService.numberWithCommas(gamerMatch.damage_done)} / {UtilityService.numberWithCommas(gamerMatch.damage_taken)})
                            </Small>
                        </>
                    )
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
