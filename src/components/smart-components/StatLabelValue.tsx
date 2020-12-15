import {LabelValue} from "../SmartComponents";
import {Show, Text} from "../SimpleComponents";
import UtilityService from "../../services/UtilityService";
import {COLORS} from "../../config/CONSTANTS";
import React from "react";

export default function StatLabelValue({style, label, statValue, inline = true, size = "sm", compareStatLabel = null, compareStatValue=null, lowerIsBetter=false, roundingDecimals=2}){
    let value = UtilityService.round(statValue, roundingDecimals)
    let component =  <Text>{value}</Text>
    if(compareStatValue){

        let diffValue = (statValue - compareStatValue) / compareStatValue
        let color = statValue > compareStatValue ? COLORS.GREEN : COLORS.RED;

        if(lowerIsBetter){
            color = statValue < compareStatValue ? COLORS.GREEN : COLORS.RED;
            diffValue =  (compareStatValue - statValue) / statValue;
        }

        let percentDiff =  UtilityService.numberToPercentage(diffValue, 1);
        component = <Text>
            {UtilityService.round(statValue, 2)}
            <Text title={compareStatLabel || ''} bold style={{marginLeft: '5px', color:  color}}>
                <Show show={statValue >compareStatValue}>+</Show>{percentDiff}
            </Text>
        </Text>
    }
    return    <LabelValue style={style}
                            inline={inline}
                            size={size}
                            label={label}
                            value={component}/>
}