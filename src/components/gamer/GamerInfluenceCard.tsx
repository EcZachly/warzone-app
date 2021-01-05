import React from 'react';
import _ from 'lodash';

import {Box, Card, CardBody, Small, Text} from '../SimpleComponents';
import {Gamer} from './GamerTypes';
import {GamerLink, GamerService} from './index';
import {StatLabelValue} from '../SmartComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export default function GamerInfluenceCard({gamer, relationships}) {

    let helpingGamer = {
        username: relationships[0].helping_player,
        platform: relationships[0].helping_player_platform
    } as Gamer;



    let gamerLink = (
        <GamerLink gamer={gamer}/>
    );
    let gamerStats = getStatLabelValuesForPerson('gamer');



    let helperLink = (
        <GamerLink gamer={helpingGamer}/>
    );
    let helperStats = getStatLabelValuesForPerson('helper');

    

    return (
        <Card className={'gamer-influence-card'}>
            <CardBody>
                {generateGamerHelperContainer(gamerLink, helperLink, gamerStats)}

                {generateGamerHelperContainer(helperLink, gamerLink, helperStats)}
            </CardBody>
        </Card>
    );



    function generateGamerHelperContainer(gamer, helper, stats) {
        return (
            <Box className={'gamer-helper-container'}>
                <Box>
                    <Box>{gamer}</Box>

                    <Box>
                        <Text type={'help'}>
                            <Small>
                                while playing with
                            </Small>
                        </Text>
                    </Box>

                    <Box>{helper}</Box>
                </Box>

                <Box className={'stat-container'}>
                    {stats}
                </Box>
            </Box>
        );
    }


    function getStatLabelValuesForPerson(type: 'gamer' | 'helper') {
        let isGamer = (type === 'gamer');

        return relationships.map((relationship) => {
            let statName = GamerService.sanitizeStatKey(relationship['relationship_stat']);

            return (
                <StatLabelValue style={{marginBottom: '0px'}}
                                lowerIsBetter={relationship.lower_is_better}
                                size={'sm'}
                                label={statName}
                                statValue={isGamer ? relationship.stat_with_player : relationship.helper_stat_with_player}
                                compareStatLabel={'compared with overall ' + statName}
                                compareStatValue={isGamer ? relationship.overall_stat : relationship.helper_overall_stat}/>
            );
        });
    }
}

