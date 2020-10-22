import React from 'react';
import {Badge} from '../SimpleComponents';
//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerClassBadge({gamerCategory, gamerStat}: GamerClassBadgeProps) {
    let style = {color: 'blue'};
    let categoryName = '';
    let keys = Object.keys(gamerCategory);
    keys.sort((left, right) => gamerCategory[left]['percentile'] < gamerCategory[right]['percentile'] ? -1 : 1)
    keys.forEach((percentileKey) => {
        if(gamerStat >= parseFloat(gamerCategory[percentileKey]['value'])){
            categoryName = percentileKey
        }
    })

    if(!categoryName){
        categoryName = keys[0];
    }
    let description = gamerCategory['description'] ? gamerCategory['description'] : '';
    return (
        <Badge size={'sm'} title={description} style={style}>
            {categoryName || ''}
        </Badge>
    );
}

type GamerClassBadgeProps = {
    gamerCategory: object,
    gamerStat: number
}