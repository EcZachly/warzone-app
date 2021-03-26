import React from 'react';

import ClassBadge from './ClassBadge';
import {Box} from './../SimpleComponents';

import {ClassDescriptionMap, RawClass} from './ClassTypes';
import TypeService from '../../services/TypeService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export type ClassBadgeProps = {
    subject: Record<any, unknown>,
    classDescriptions?: ClassDescriptionMap
}

export default function ClassBadgeList({subject, classDescriptions}: ClassBadgeProps) {
    if (TypeService.isObject(classDescriptions, true)) {
        return (
            <Box className={'gamer-class-badge-list-container'}>
                {getBadgeList()}
            </Box>
        );
    } else {
        return (<></>);
    }



    function getBadgeList() {
        return getSanitizedKeys().map((key) => {
            let selectedDescription = classDescriptions[key] as RawClass;
            let {percentiles, category} = selectedDescription;

            const statValue = subject[category] as number;
            const isTiered = key.includes('tier');

            return (
                <ClassBadge statName={category}
                            key={key}
                            category={percentiles}
                            stat={statValue}
                            tiered={isTiered}/>
            );
        });
    }



    function getSanitizedKeys() {
        return Object.keys(classDescriptions)
            .sort((left) => left.includes('tier') ? -1 : 1)
            .filter((key) => key.includes('cutoff'));
    }

}