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
        let keys =  Object.keys(classDescriptions);
        keys.sort((left, right)=> {
            if(left.includes('tier')){
                return -1;
            }
           return 1;
        });
        const badges = keys.filter((key) => key.includes('cutoff')).map((key) => {
                const percentiles = classDescriptions[key]['percentiles'];
                const statValue = subject[classDescriptions[key]['category']];
                const tiered = key.includes('tier');
                return (
                    <ClassBadge statName={classDescriptions[key]['category']}
                                category={percentiles}
                                stat={statValue as number}
                                tiered={tiered}/>
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