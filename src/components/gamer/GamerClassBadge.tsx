import React from 'react';
import {Badge} from '../SimpleComponents';
import {Tooltip} from '../SmartComponents';
import {GamerClassDetail} from '../AppComponents';
//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerClassBadge({gamerCategory, gamerStat, statName}: GamerClassBadgeProps) {
    let style = {color: 'blue'};
    let categoryName = '';
    let keys = Object.keys(gamerCategory);
    keys.sort((left, right) => gamerCategory[left]['percentile'] < gamerCategory[right]['percentile'] ? -1 : 1)
    keys.forEach((percentileKey) => {
        if (gamerStat >= parseFloat(gamerCategory[percentileKey]['value'])) {
            categoryName = percentileKey
        }
    })

    if (!categoryName) {
        return <div></div>
    }
    
    let description = gamerCategory['description'] ? gamerCategory['description'] : '';
    return (
        <Tooltip showFunction={()=> <GamerClassDetail statName={statName} gamerCategory={gamerCategory} keys={keys} gamerStat={gamerStat}/>}>
            <Badge size={'sm'} title={description} style={style}>
                {categoryName || ''}
            </Badge>
        </Tooltip>
    );
}

type GamerClassBadgeProps = {
    gamerCategory: object,
    gamerStat: number,
    statName: string
}