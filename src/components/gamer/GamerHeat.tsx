import React from 'react';

import {Box, Image, Show, Small, Text} from '../SimpleComponents';
import {Gamer} from './GamerTypes';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer: Gamer,
    classDescriptions?: object,
    size?: 'sm'
};


export default function GamerHeat({gamer, size}: GamerCardProps) {
    let heatFlames = <div/>;

    if (gamer.heat_rating > 0) {
        let delta = gamer.heat_score;

        if (delta >= 0.1) {
            let cnt = 0;
            let array = [];

            let standardHeight = 18;
            let standardWidth = 16;

            let height = (size === 'sm' ? .75 : 1) * standardHeight + 'px';
            let width = (size === 'sm' ? .75 : 1) * standardWidth + 'px';



            while (cnt < gamer.heat_rating) {
                array.push(<Image className={'heat-indicator'}
                                  style={{width: width, height: height, opacity: (52 + (cnt * 12)) + '%'}}
                                  src={'/assets/images/icons/heat-sm.png'}
                                  alt={'number of flames means this player is on a hot streak'}/>);
                cnt = cnt + 1;
            }

            let viewDelta = delta.toFixed(1) + '%';

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
