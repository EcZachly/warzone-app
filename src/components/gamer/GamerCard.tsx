import React from 'react';

import {Card, CardBody, Small, CardHeader, Table, TableBody, TableData, TableHeader, Badge} from '../SimpleComponents';
import {GamerLink} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//

//TODO CREATE Gamer type and enforce it here
export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object
}



export default function GamerCard({gamer, classDescriptions}: GamerCardProps) {
    let classBadgeList = <ClassBadgeList subject={gamer as object} classDescriptions={classDescriptions} />
    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>

                <Small className="aliases">({gamer.aliases.join(',')})</Small>

                {classBadgeList}
            </CardHeader>
            <CardBody>
                <Table>
                    <TableHeader>KDR</TableHeader>
                    <TableHeader>Max Kills</TableHeader>
                    <TableHeader>Gulag Win Rate</TableHeader>
                    <TableBody>
                        <TableData>{gamer['kdr']}</TableData>
                        <TableData>{gamer['max_kills']}</TableData>
                        <TableData>{gamer['gulag_win_rate']}</TableData>
                    </TableBody>
                </Table>
            </CardBody>

        </Card>
    );
}
