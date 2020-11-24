import React from 'react';

import {
    Card,
    CardBody,
    Small,
    CardHeader,
    Table,
    TableBody,
    TableData,
    TableHeader,
    Badge,
    Image
} from '../SimpleComponents';
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
    let classBadgeList = <ClassBadgeList  subject={gamer as object} classDescriptions={classDescriptions}/>
    let heatFlames = <div/>
    if (gamer.heat_rating > 0) {
        let cnt = 0;
        let array = []
        while (cnt < gamer.heat_rating) {
            array.push(<Image style={{width: '25px', height: 'auto'}} src={'/assets/images/flame.jpeg'}
                              alt={'number of flames means this player is on a hot streak'}/>)
            cnt = cnt + 1
        }
        let delta = (gamer.last_10_rolling_average_kdr/gamer.last_100_rolling_average_kdr - 1)*100

        let viewDelta = delta.toFixed(1) + '%'

        heatFlames = <div>
            <div style={{float: 'left'}}>{array}</div>
            <div style={{marginLeft: '10px', float: 'left'}}> KDR <b style={{color: 'green'}}>+{viewDelta}</b> better than usual</div>
        </div>
    }


    return (
        <Card style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <CardHeader>
                <GamerLink gamer={gamer}/>
                <Small className="aliases">({gamer.aliases.join(',')})</Small>
                {heatFlames}
                <div style={{clear: 'both'}}>
                    {classBadgeList}
                </div>
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
