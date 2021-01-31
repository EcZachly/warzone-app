import React from 'react';
import _ from 'lodash';

import {Box, Card, CardBody, Small, Text} from '../SimpleComponents';
import {Gamer} from './GamerTypes';
import {GamerLink, GamerService} from './index';
import {StatLabelValue} from '../SmartComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export default function GamerInfluenceCard({gamer, relationships}) {
    const helpingGamer = {
        username: relationships[0].helping_player,
        platform: relationships[0].helping_player_platform,
        aliases: relationships[0].helper_aliases
    } as Gamer;


    const gamerLink = (
        <GamerLink gamer={gamer}/>
    );
    const gamerStats = getStatLabelValuesForPerson('gamer');



    const helperLink = (
        <GamerLink gamer={helpingGamer}/>
    );
    const helperStats = getStatLabelValuesForPerson('helper');



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
        const isGamer = (type === 'gamer');

        const numberOfMatchesRelationship = {
            relationship_stat: 'num_matches',
            label: 'Matches',
            stat_with_player: relationships[0].num_matches,
            helper_stat_with_player: relationships[0].num_matches
        };

        return [numberOfMatchesRelationship, ...relationships].map((relationship) => {
            const statName = GamerService.sanitizeStatKey(relationship['relationship_stat']);
            const roundingDecimals = 2;
            let statValue = isGamer ? relationship.stat_with_player : relationship.helper_stat_with_player;
            let compareStatValue = isGamer ? relationship.overall_stat : relationship.helper_overall_stat;
            let suffix = '';
            if(statName.includes('Rate')){
                statValue = 100 *  statValue;
                compareStatValue = 100 * compareStatValue;
                suffix = '%';
            }


            return (
                <StatLabelValue style={{marginBottom: '0px'}}
                                lowerIsBetter={relationship.lower_is_better}
                                size={'sm'}
                                label={statName}
                                roundingDecimals={roundingDecimals}
                                statValue={statValue}
                                suffix={suffix}
                                compareStatLabel={'compared with overall ' + statName}
                                compareStatValue={compareStatValue}/>
            );
        });
    }
}

