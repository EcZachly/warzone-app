import React from 'react';
import { Card, CardText, CardTitle} from 'react-mdl/lib/Card';
import {Table, TableHeader } from 'react-mdl/lib/DataTable';
export default function GamerCard({gamer}) {
    return (
        <Card shadow={0} style={{width: '512px', 'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
            <CardTitle>
                <a href={"/gamer/" + gamer.platform + "/" + gamer.username}>{gamer.username}</a>
                <small className="aliases">({gamer.aliases.join(',')})</small>
            </CardTitle>
            <CardText>
                <Table
                    rows={[{kdr: gamer.kdr, max_kills: gamer.max_kills, gulag_win_rate: gamer.gulag_win_rate}]}
                >
                    <TableHeader name="kdr" tooltip="All time kill to death ratio">KDR</TableHeader>
                    <TableHeader name="max_kills" tooltip="Most kills in 1 match">Max Kills</TableHeader>
                    <TableHeader name="gulag_win_rate" tooltip="Gulag win rate, excluding flag capture gulags">Gulag Win Rate</TableHeader>
                </Table>
            </CardText>
        </Card>
    )
}
