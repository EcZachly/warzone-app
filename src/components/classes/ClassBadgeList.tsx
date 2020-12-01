import React from 'react';

import ClassBadge from './ClassBadge';

import {Box} from './../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export type ClassBadgeProps = {
    subject: object,
    classDescriptions?: object
}

export default function ClassBadgeList({subject, classDescriptions}: ClassBadgeProps) {
    if (classDescriptions) {
        let badges = Object.keys(classDescriptions).filter((key) => key.includes('cutoff')).map((key) => {
                const percentiles = classDescriptions[key]['percentiles'];
                let statValue = subject[classDescriptions[key]['category']];
                return (
                    <ClassBadge statName={classDescriptions[key]['category']} category={percentiles} stat={statValue}/>
                );
            }
        );

        return (
            <Box className={'gamer-class-badge-list-container'}>
                {badges}
            </Box>
        );
    } else {
        return (<></>);
    }
}