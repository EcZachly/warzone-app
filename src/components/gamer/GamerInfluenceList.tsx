import React from 'react';

import GamerInfluenceCard from './GamerInfluenceCard';

import {Box} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function GamerInfluenceList({gamer, teammateRows}) {

    let relationships = {};

    teammateRows.forEach((relationship) => {
        let key = relationship['helping_player'] + '-' + relationship['helping_player_platform'];

        if (!relationships[key]) {
            relationships[key] = [relationship];
        } else {
            relationships[key].push(relationship);
        }
    });

    return (
        <Box className={'gamer-influence-card-list-container'}>
            {
                Object.values(relationships).map((relationship) => {
                    return (
                        <GamerInfluenceCard gamer={gamer}
                                            relationships={relationship}/>
                    );
                })
            }
        </Box>
    );
}

