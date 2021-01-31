import React from 'react';

import ClassBadge from './ClassBadge';

import {Box} from './../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export type ClassBadgeProps = {
    subject: Record<any, unknown>,
    classDescriptions?: Record<any, unknown>
}

export default function ClassBadgeList({subject, classDescriptions}: ClassBadgeProps) {
    if (classDescriptions) {
        const badges = Object.keys(classDescriptions).filter((key) => key.includes('cutoff')).map((key) => {
                const percentiles = classDescriptions[key]['percentiles'];
                const statValue = subject[classDescriptions[key]['category']];

                return (
                    <ClassBadge statName={classDescriptions[key]['category']}
                                category={percentiles}
                                stat={statValue as number}/>
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