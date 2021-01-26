import React from 'react';
import {Badge} from '../SimpleComponents';
import {Tooltip} from '../SmartComponents';
import {ClassDetail} from './index';
import UtilityService from '../../services/UtilityService';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerClassBadgeProps = {
    category: object,
    stat: number,
    statName: string
}

export default function ClassBadge({category, stat, statName}: GamerClassBadgeProps) {
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

    const description = category['description'] ? category['description'] : '';
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
                             stat={stat}/>
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

