import React from 'react';
import {Card, CardBody, CardHeader, Table, TableBody, TableData, TableHeader} from '../SimpleComponents';
export default function SquadCard({squad}) {
    let gamerLinks = squad.gamers.map((gamer)=>{
        return <div>
            <a href={"/gamer/" + gamer.split('-')[0] + "/" + gamer.split('-')[1]}>{gamer.split('-')[1]}</a>
            <br/>
        </div>
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
