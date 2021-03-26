import React from 'react';

import {Badge} from '../SimpleComponents';
import {Tooltip} from '../SmartComponents';
import {ClassDetail} from './index';

import UtilityService from '../../services/UtilityService';
import {COLORS} from '../../config/CONSTANTS';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerClassBadgeProps = {
    category: Record<any, unknown>,
    stat: number,
    statName: string,
    tiered: boolean
}

export default function ClassBadge({category, stat, statName, tiered = false}: GamerClassBadgeProps) {
    const style = {};

    let categoryName = '';



    const keys = Object.keys(category);

    keys.sort((left, right) => category[left]['percentile'] < category[right]['percentile'] ? -1 : 1);

    keys.forEach((percentileKey) => {
        if (stat >= parseFloat(category[percentileKey]['value'])) {
            categoryName = percentileKey;
        }
    });

    if (!categoryName) {
        return <></>;
    }


    if (tiered) {
        let colorMap = {
            bronze: COLORS.TIER_BRONZE,
            silver: COLORS.TIER_SILVER,
            gold: COLORS.TIER_GOLD,
            platinum: COLORS.TIER_PLATINUM,
            diamond: COLORS.TIER_DIAMOND
        };

        let tier = categoryName.split('_')[0];

        if (['master', 'legend'].includes(tier)) {
            style['border'] = 'black';
            style['color'] = 'black';
            style['font-weight'] = 'bold';
            style['background-color'] = 'white';
        } else {
            style['background-color'] = colorMap[tier];
            style['color'] = 'black';
        }
    }

    const description = (category['description'] ? category['description'] : '') as string;
    let badgeRef;

    return (
        <Tooltip style={{display: 'inline-block', marginRight: '3px'}} showFunction={(tooltipProps) => {
            return (
                <ClassDetail {...tooltipProps}
                             height={250}
                             width={500}
                             badgeRef={badgeRef}
                             statName={statName}
                             category={category}
                             keys={keys}
                             stat={stat}
                             tiered={tiered}/>
            );
        }}>
            <Badge className={'gamer-class-badge'}
                   innerRef={(ref) => badgeRef = ref}
                   size={'sm'}
                   color={'dark'}
                   title={description}
                   style={style}>
                {UtilityService.camelToProperCase(categoryName)}
            </Badge>
        </Tooltip>
    );
}

