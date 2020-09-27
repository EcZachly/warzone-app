import React from 'react';
import {Card, CardBody, CardHeader, Table, TableBody, TableData, TableHeader, Box} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';
export default function SquadCard({squad}) {
    let gamerLinks = squad.gamers.map((gamer)=>{
        let [platform, username] = gamer.split('-');
        return <GamerLink gamer={{platform: platform, username: username}}/>
    })
    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
            <CardHeader>
                {gamerLinks}
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
                        <TableData>{squad.win_percentage}</TableData>
                        <TableData>{squad.total_wins}</TableData>
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}
