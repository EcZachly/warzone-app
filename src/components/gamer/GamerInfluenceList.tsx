import React from 'react';

import GamerInfluenceCard from './GamerInfluenceCard';

import {Box} from '../SimpleComponents';
import TypeService from '../../services/TypeService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerInfluenceList({gamer, teammateRows}) {
    const MIN_MATCHES_TO_SHOW = 5;

    const relationshipMap = {};

    teammateRows.forEach((relationship) => {
        const key = relationship['helping_player'] + '-' + relationship['helping_player_platform'];

        if (!relationshipMap[key]) {
            relationshipMap[key] = [relationship];
        } else {
            relationshipMap[key].push(relationship);
        }
    });

    return (
        <Box className={'gamer-influence-card-list-container'}>
            {
                Object.values(relationshipMap).filter((relationshipList) => {
                    return TypeService.isNumeric(relationshipList[0].num_matches) && relationshipList[0].num_matches >= MIN_MATCHES_TO_SHOW;
                }).map((relationshipList) => {
                    return (
                        <GamerInfluenceCard gamer={gamer}
                                            relationships={relationshipList}/>
                    );
                })
            }
        </Box>
    );
}

