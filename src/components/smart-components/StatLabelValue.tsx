import React from 'react';

import {LabelValue} from '../SmartComponents';
import {Show, Text} from '../SimpleComponents';
import UtilityService from '../../services/UtilityService';
import {COLORS} from '../../config/CONSTANTS';
import TypeService from '../../services/TypeService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function StatLabelValue(props) {
    const {
        style,
        label,
        statValue,
        inline = true,
        size = 'sm',
        compareStatLabel = null,
        compareStatValue = null,
        lowerIsBetter = false,
        roundingDecimals = 2
    } = props;

    let statIsNull = TypeService.isNumeric(statValue) === false;

    let component = (
        <Text>{statIsNull ? '-' : UtilityService.round(statValue, roundingDecimals)}</Text>
    );

    if (compareStatValue && !statIsNull) {
        let diffValue = (statValue - compareStatValue) / compareStatValue;
        let color = statValue > compareStatValue ? COLORS.GREEN : COLORS.RED;

        if (lowerIsBetter) {
            color = statValue < compareStatValue ? COLORS.GREEN : COLORS.RED;
            diffValue = (compareStatValue - statValue) / statValue;
        }

        let percentDiff = UtilityService.numberToPercentage(diffValue, 1);

        component = (
            <Text>
                {UtilityService.round(statValue, roundingDecimals)}

                <Text title={compareStatLabel || ''}
                      bold
                      style={{marginLeft: '5px', color: color}}>
                    <Show show={lowerIsBetter === false ? statValue > compareStatValue : statValue < compareStatValue}>
                        +
                    </Show>{percentDiff}
                </Text>
            </Text>
        );
    }

    return (
        <LabelValue style={style}
                    inline={inline}
                    size={size}
                    label={label}
                    value={component}/>
    );
}