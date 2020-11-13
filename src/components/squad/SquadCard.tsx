import React from 'react';
import {Card, CardBody, CardHeader, Table, TableBody, TableData, TableHeader} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';
import {ClassBadgeList} from "../classes";
export default function SquadCard({squad, classDescriptions}) {
    //Only use classes that correspond with the right team type, otherwise we'd be comparing duos to quads, etc
    let filteredDescriptions = classDescriptions.filter((description)=> description.team_type == squad.team_type)[0];

    let classBadgeList = <ClassBadgeList subject={squad as object} classDescriptions={filteredDescriptions} />
    const gamerLinks = squad.gamers.map((gamer)=>{
        const [platform, username] = gamer.split('-');
        return <GamerLink gamer={{platform: platform, username: username}}/>;
    });
    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <CardHeader>
                {gamerLinks}
                {classBadgeList}
            </CardHeader>

            <CardBody>
                <Table>
                    <TableHeader>KDR</TableHeader>
                    <TableHeader>Gulag Win Rate</TableHeader>
                    <TableHeader>Win Rate</TableHeader>
                    <TableHeader>Total Wins</TableHeader>
                    <TableBody>
                        <TableData>{squad.kdr}</TableData>
                        <TableData>{squad.gulag_win_rate}</TableData>
                        <TableData>{squad.win_percentage.toFixed(2) + '%'}</TableData>
                        <TableData>{squad.total_wins}</TableData>
                    </TableBody>
                </Table>
            </CardBody>

        </Card>
    );
}
