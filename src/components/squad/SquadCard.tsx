import React, {useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Table,
    TableBody,
    TableData,
    TableHeader,
    TableRow
} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';
import {ClassBadgeList} from "../classes";
export default function SquadCard({squad, classDescriptions}) {
    //Only use classes that correspond with the right team type, otherwise we'd be comparing duos to quads, etc
    let filteredDescriptions = classDescriptions.filter((description)=> description.team_type == squad.team_type)[0];

    let [statCnt, setStatCnt] = useState(5)
    let classBadgeList = <ClassBadgeList subject={squad as object} classDescriptions={filteredDescriptions} />
    const gamerLinks = squad.gamers.map((gamer)=>{
        const [platform, username] = gamer.split('-');
        return <GamerLink gamer={{platform: platform, username: username}}/>;
    });

    let stats = {
        'KDR': squad.kdr,
        'Win Percentage': squad.win_percentage.toFixed(2) + '%',
        'Gulag Win Rate': squad.gulag_win_rate,
        'Total Wins': squad.total_wins,
        'Number of Matches': squad.num_matches,
        'Average Placement': squad.avg_placement.toFixed(2) ,
        'Kills per Game': squad.kills_per_game.toFixed(2) ,
        'Score per Game': squad.score_per_game.toFixed(0) ,
        'Teams Wiped per Game': squad.teams_wiped.toFixed(2) ,
        'Total Teams Wiped': squad.total_teams_wiped,
        'Legendary Crates Looted per Game': squad.caches_opened.toFixed(2) ,
        'Total Legendary Crates Looted': squad.total_caches_opened,
        'Headshots per Game': squad.headshots.toFixed(2) ,
        'Total Headshots': squad.total_headshots,
    };


    let rows = Object.keys(stats).filter((val, index)=> index < statCnt).map((key)=>{
        return (
            <TableRow>
                <TableData>{key}</TableData>
                <TableData>{stats[key]}</TableData>
            </TableRow>
        );
    });

    let table = <Table style={{width: '50%', float: 'right'}}>
        <TableHeader>Stat</TableHeader>
        <TableHeader>Value</TableHeader>
        <TableBody>
            {rows}
        </TableBody>
    </Table>



    let showMore =  statCnt < Object.keys(stats).length ? <Button onClick={() => setStatCnt(statCnt + 10)}>{"Show more stats"}</Button> : <div/>;

    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <CardHeader>
                <div style={{width: '50%', float: 'left'}}>
                    {gamerLinks}
                    {classBadgeList}
                </div>
                <div>
                    {showMore}
                    {table}
                </div>
            </CardHeader>

            <CardBody>

            </CardBody>

        </Card>
    );
}
