import React, {useState} from 'react';

import {
    Button,
    Box,
    Card,
    Show,
    CardBody,
    CardHeader,
    Table,
    TableBody,
    TableData,
    TableHeader,
    TableRow
} from '../SimpleComponents';
import {LabelValue} from './../SmartComponents';
import {GamerLink} from '../AppComponents';

import {ClassBadgeList} from '../classes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function SquadCard({squad, classDescriptions}) {
    //Only use classes that correspond with the right team type, otherwise we'd be comparing duos to quads, etc
    let filteredDescriptions = classDescriptions.filter((description) => description.team_type == squad.team_type)[0];

    let stats = {
        'Total Matches': {
            value: squad.num_matches,
            placement: 'left'
        },
        'Win Percentage': {
            value: squad.win_percentage.toFixed(2) + '% (' + squad.total_wins + ' game' + (squad.total_wins === 1 ? '' : 's') + ')',
            placement: 'left'
        },
        'Average Placement': {
            value: squad.avg_placement.toFixed(1),
            placement: 'left'
        },
        'Average KDR': {
            value: squad.kdr,
            placement: 'left'
        },
        'Gulag Win Rate': {
            value: squad.gulag_win_rate,
            placement: 'left'
        },

        'Average Kills per Game': {
            value: squad.kills_per_game && squad.kills_per_game.toFixed(2),
            placement: 'right'
        },
        'Average Score per Game': {
            value: squad.score_per_game.toFixed(0),
            placement: 'right'
        },
        'Average Teams Wiped per Game': {
            value: squad.teams_wiped && squad.teams_wiped.toFixed(2),
            placement: 'right'
        },
        'Total Teams Wiped': {
            value: squad.total_teams_wiped,
            placement: 'right'
        },
        'Average Legendary Crates Looted per Game': {
            value: squad.caches_opened && squad.caches_opened.toFixed(2),
            placement: 'right'
        },
        'Total Legendary Crates Looted': {
            value: squad.total_caches_opened,
            placement: 'right'
        },
        'Average Headshots per Game': {
            value: squad.headshots && squad.headshots.toFixed(2),
            placement: 'right'
        },
        'Total Headshots': {
            value: squad.total_headshots,
            placement: 'right'
        },
    };




    return (
        <Card className={'squad-card'} style={{marginBottom: '15px'}}>
            <CardHeader>
                <Box>
                    {
                        squad.gamers.map((gamer) => {
                            const [platform, username] = gamer.split('-');

                            return (
                                <GamerLink inline gamer={{platform: platform, username: username}}/>
                            );
                        })
                    }

                    <ClassBadgeList subject={squad as object}
                                    classDescriptions={filteredDescriptions}/>
                </Box>
            </CardHeader>

            <CardBody>
                <Box style={{display: 'flex', flexFlow: 'wrap'}}>

                    <Box className={'details main-details'}>
                        {getSquadStatsByColumn('left').map(({value, label}) => {
                            return (
                                <LabelValue label={label} value={value}/>
                            )
                        })}
                    </Box>

                    <Box className={'details support-details'} style={{height: 'auto', display: 'flex', alignContent: 'flex-start', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                        {getSquadStatsByColumn('right').map(({value, label}) => {
                            return (
                                <LabelValue size={'sm'} style={{width: '45%'}} label={label} value={value}/>
                            )
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
