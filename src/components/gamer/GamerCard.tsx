import React from 'react';
import {Card, CardBody, CardHeader, Table, TableBody, TableData, TableHeader} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';

import {Gamer} from './GamerTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//

//TODO CREATE Gamer type and enforce it here
type GamerCardProps = {
    gamer: Gamer
}



export default function GamerCard({gamer} : GamerCardProps) {
    let classes = Object.keys(gamer.gamer_class_object).map((key)=>
       <div>
           <small>{key + ' : ' + gamer.gamer_class_object[key]}</small>
           <br/>
       </div>

    )
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
