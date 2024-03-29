import React from 'react';

import {Box, Image, Show, Small, Text} from '../SimpleComponents';
import {Gamer} from './GamerTypes';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: Record<any, unknown>,
    size?: 'sm'
};


export default function GamerHeat({gamer, size}: GamerCardProps) {
    let heatFlames = <div/>;

    if (gamer.heat_rating > 0) {
        const delta = gamer.heat_score;

        if (delta >= 0.1) {
            let count = 0;
            const array = [];

            const standardHeight = 18;
            const standardWidth = 16;

            const height = (size === 'sm' ? .75 : 1) * standardHeight + 'px';
            const width = (size === 'sm' ? .75 : 1) * standardWidth + 'px';



            while (count < gamer.heat_rating) {
                array.push(
                    <Image className={'heat-indicator'}
                           key={count}
                           style={{width: width, height: height, opacity: (52 + (count * 12)) + '%'}}
                           src={'/assets/images/icons/heat-sm.png'}
                           alt={'number of flames means this player is on a hot streak'}/>
                );
                count = count + 1;
            }

            const viewDelta = delta.toFixed(1) + '%';

            heatFlames = (
                <Box className={'heat-container'}>
                    <Box className={'heat-scores'}>
                        {array}
                    </Box>

                    <Small className={'details'}>
                        KDR <Text className={'percentage'}>+{viewDelta}</Text> better than usual
                    </Small>
                </Box>
            );
        }
    }

    const showHeatScore = gamer.heat_rating > 0;

    return (
        <Show show={showHeatScore}>
            {heatFlames}
        </Show>
    );
}
