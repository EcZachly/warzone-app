import React from 'react';
import {Card, CardBody, CardHeader, Table, TableBody, TableData, TableHeader, Badge} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//

//TODO CREATE Gamer type and enforce it here
type GamerCardProps = {
    gamer: Gamer
}



export default function GamerCard({gamer} : GamerCardProps) {
    let keys = Object.keys(gamer).filter((key)=> key.includes('class'));
    keys.sort();
    let classes = keys.map((key)=>{
          return  <Badge key={key} style={{margin: '2px'}}>
                <small>{gamer[key]}</small>
            </Badge>
    }

    );
    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>

                <br/>

                <small className="aliases">({gamer.aliases.join(',')})</small>

                {classes}
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
