import {GamerClassBadge} from "./index";
import React from "react";
import {GamerCardProps} from "./GamerCard";

export default function GamerClassBadgeList({gamer, classDescriptions}: GamerCardProps) {
    let badges = Object.keys(classDescriptions).map((key) => {
            const percentiles = classDescriptions[key]['percentiles'];
            let statValue = gamer[classDescriptions[key]['category']];
            return (
                <GamerClassBadge gamerCategory={percentiles} gamerStat={statValue}/>
            );
        }
    );

    return <div>{badges}</div>;
}