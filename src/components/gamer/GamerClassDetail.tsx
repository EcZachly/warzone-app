import React from 'react';
import {Card, CardBody, CardHeader} from '../SimpleComponents';
import _ from 'lodash';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerClassDetail({gamerCategory, statName, gamerStat, keys}: GamerClassDetailProps) {
    let categoryName = '';
    if (!categoryName) {
        categoryName = keys[0];
    }
    let gamerStatDisplayValue = parseFloat(gamerStat.toString()).toFixed(2).toString();
    if(statName.includes('percent')){
        gamerStatDisplayValue = gamerStatDisplayValue.toString() + '%';
    }
    let description = gamerCategory['description'] || gamerCategory['category'] ||  '';
    let statDisplayName = statName.split('_').map(_.capitalize).join(' ');

    let displayPercentiles = keys.map((val)=>{
        let displayName = val.split('_').map(_.capitalize).join(' ');
        let percentile = gamerCategory[val]['percentile'];
        let percentileVal = gamerCategory[val]['value'];

        let displayValue = percentileVal.toFixed(2);
        let perMessage = " per game";

        if(statName.includes('percent')){
            displayValue = percentileVal.toFixed(2) + '%';
            perMessage = '';
        }
        if(statName.includes('mins')){
            displayValue = percentileVal.toFixed(2) + ' minutes';
        }
        return (
            <div>
                <li>{displayName}, {"Better than " + percentile.toFixed(2)*100 as string + '% of players'}, {">" + displayValue} {perMessage}</li>
            </div>
        )
    })

    return (
        <Card>
            <CardHeader>
                <p> This class is based on the stat: <b>{statDisplayName}</b></p>
                <p> This gamer averages: <b>{gamerStatDisplayValue}</b></p>
            </CardHeader>
            <CardBody>
                <h3>{description}</h3>
                <ul>
                    {displayPercentiles}
                </ul>
            </CardBody>
        </Card>
    );
}

type GamerClassDetailProps = {
    gamerCategory?: object,
    gamerStat?: number,
    statName?: string,
    keys?: string[]
}