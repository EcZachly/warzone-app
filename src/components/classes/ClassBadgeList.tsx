import ClassBadge from "./ClassBadge";
import React from "react";
export type ClassBadgeProps = {
    subject: object,
    classDescriptions?: object
}

export default function ClassBadgeList({subject, classDescriptions}: ClassBadgeProps) {
    let badges = Object.keys(classDescriptions).filter((key)=> key.includes('cutoff')).map((key) => {
            const percentiles = classDescriptions[key]['percentiles'];
            let statValue = subject[classDescriptions[key]['category']];
            return (
                <ClassBadge statName={classDescriptions[key]['category']} category={percentiles} stat={statValue}/>
            );
        }
    );

    return <div>{badges}</div>;
}