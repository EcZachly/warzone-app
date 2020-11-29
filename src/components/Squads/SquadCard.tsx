import React, {useState} from 'react';

import {
    Button,
    Box,
    Card,
    Show,
    CardBody,
    CardHeader,
    Small
} from '../SimpleComponents';
import {LabelValue} from './../SmartComponents';
import {GamerLink} from '../AppComponents';
import UtilityService from '../../services/UtilityService';

import {ClassBadgeList} from '../classes';
import {GamerLinkList} from '../gamer';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function SquadCard({squad, classDescriptions}) {
    //Only use classes that correspond with the right team type, otherwise we'd be comparing duos to quads, etc
    let filteredDescriptions = classDescriptions.filter((description) => description.team_type == squad.team_type)[0];

    let stats = {
        'Total Matches': {
            value: UtilityService.numberWithCommas(squad.num_matches),
            placement: 'left'
        },
        'Win Percentage': {
            value: squad.win_percentage.toFixed(2) + '% (' + squad.total_wins + ' game' + (squad.total_wins === 1 ? '' : 's') + ')',
            placement: 'left'
        },
        'Average Placement': {
            value: UtilityService.round(squad.avg_placement, 1),
            placement: 'left'
        },
        'Average KDR': {
            value: UtilityService.round(squad.kdr, 2),
            placement: 'left'
        },
        'Gulag Win Rate': {
            value: squad.pretty_gulag_win_rate,
            placement: 'left'
        },

        'Average Kills per Game': {
            value: UtilityService.round(squad.kills_per_game || 0, 2),
            placement: 'right'
        },
        'Average Score per Game': {
            value: UtilityService.numberWithCommas(UtilityService.round(squad.score_per_game || 0, 0)),
            placement: 'right'
        },
        'Average Teams Wiped per Game': {
            value: UtilityService.round(squad.teams_wiped || 0, 2),
            placement: 'right'
        },
        'Total Teams Wiped': {
            value: UtilityService.numberWithCommas(squad.total_teams_wiped || 0),
            placement: 'right'
        },
        'Average Legendary Crates Looted per Game': {
            value: squad.caches_opened && UtilityService.round(squad.caches_opened, 2),
            placement: 'right'
        },
        'Total Legendary Crates Looted': {
            value: UtilityService.numberWithCommas(squad.total_caches_opened || 0),
            placement: 'right'
        },
        'Average Headshots per Game': {
            value: squad.headshots && UtilityService.round(squad.headshots, 2),
            placement: 'right'
        },
        'Total Headshots': {
            value: UtilityService.numberWithCommas(squad.total_headshots || 0),
            placement: 'right'
        }
    };


    let gamerList = squad.gamers.map((gamer) => {
        const [platform, username] = gamer.split('-');
        return {platform, username};
    });

    return (
        <Card className={'squad-card'} style={{marginBottom: '15px'}}>
            <CardHeader style={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                    <GamerLinkList gamers={gamerList}/>

                    <ClassBadgeList subject={squad as object}
                                    classDescriptions={filteredDescriptions}/>
                </Box>

                <Box>
                    <Small>
                        <a href={'/squad/' + encodeURIComponent(squad.team_grain as string)}>View squad details</a>
                    </Small>
                </Box>
            </CardHeader>

            <CardBody>
                <Box style={{display: 'flex', flexFlow: 'wrap'}}>

                    <Box className={'details main-details'}>
                        {getSquadStatsByColumn('left').map(({value, label}) => {
                            return (
                                <LabelValue label={label} value={value}/>
                            );
                        })}
                    </Box>

                    <Box className={'details support-details'} style={{
                        height: 'auto',
                        display: 'flex',
                        alignContent: 'flex-start',
                        flexFlow: 'row wrap',
                        justifyContent: 'space-between'
                    }}>
                        {getSquadStatsByColumn('right').map(({value, label}) => {
                            return (
                                <LabelValue size={'sm'} label={label} value={value}/>
                            );
                        })}
                    </Box>
                </Box>
            </CardBody>

        </Card>
    );


    function getSquadStatsByColumn(column: 'left' | 'right') {
        let labels = Object.keys(stats);

        return labels.map((label) => {
            let statConfig = stats[label];
            statConfig.label = label;
            return statConfig;
        }).filter(({placement}) => placement === column);
    }
}
