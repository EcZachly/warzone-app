import React from 'react';
import {Badge} from '../SimpleComponents';
import {Tooltip} from '../SmartComponents';
import {GamerClassDetail} from '../AppComponents';
//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerClassBadge({gamerCategory, gamerStat, statName}: GamerClassBadgeProps) {
    let style = {color: 'blue'};
    let categoryName = '';
    let keys = Object.keys(gamerCategory);
    keys.sort((left, right) => gamerCategory[left]['percentile'] < gamerCategory[right]['percentile'] ? -1 : 1);
    keys.forEach((percentileKey) => {
        if (gamerStat >= parseFloat(gamerCategory[percentileKey]['value'])) {
            categoryName = percentileKey;
        }
    });

    if (!categoryName) {
        return <></>;
    }

    let description = gamerCategory['description'] ? gamerCategory['description'] : '';
    let badgeRef;

    return (
        <Tooltip style={{display: 'inline-block', marginRight: '3px'}} showFunction={(tooltipProps) => {
            return (
                <GamerClassDetail {...tooltipProps}
                                  height={250}
                                  width={500}
                                  badgeRef={badgeRef}
                                  statName={statName}
                                  gamerCategory={gamerCategory} keys={keys} gamerStat={gamerStat}/>
            );
        }}>
            <Badge innerRef={(ref) => badgeRef = ref} size={'sm'} title={description} style={style}>
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