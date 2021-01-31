import React from 'react';

import {Box, Card, Show, CardBody, Image, CardHeader, Small, Text} from '../SimpleComponents';

import {LabelValue, Placeholder} from './../SmartComponents';

import {GamerAliasList, GamerHeat, GamerLinkList} from './../gamer/index';
import {ClassBadgeList} from '../classes/index';
import {Gamer} from './GamerTypes';
import TypeService from '../../services/TypeService';
import UtilityService from '../../services/UtilityService';
import {UserService} from '../Users';
import {userIsLoggedIn} from '../Users/UserService';
import {UserID} from '../Users/UserTypes';
import {GamerRelationshipList} from '../GamerRelationships/GamerRelationshipTypes';
import {GamerRelationshipService} from '../GamerRelationships';


//===---==--=-=--==---===----===---==--=-=--==---===----//

export type GamerCardProps = {
    gamer?: Gamer,
    classDescriptions?: Record<any, unknown>,
    loading?: boolean,
    mode?: null | 'condensed',
    onGamerClick?: (gamer) => void
}


export default function GamerCard({gamer, classDescriptions, mode, loading, onGamerClick}: GamerCardProps) {
    const isLoading = (loading === true);

    const [currentState, updateState] = React.useState(false);
    // @ts-ignore
    const forceUpdate = React.useCallback(() => updateState(!currentState), []);

    if (isLoading === true) {
        return getLoadingCard();
    } else {
        if (!gamer) {
            return <Card/>;
        }

        console.log(gamer);

        const isCondensed = (mode === 'condensed');
        const modeClass = isCondensed ? 'condensed' : 'standard';

        const noLink = !!onGamerClick;

        const overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
        const gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills));
        const gamesPlayedIsMoreThan1000 = gamesPlayed >= 1000;

        const gamesPlayedText = (gamesPlayedIsMoreThan1000) ? '1,000+' : UtilityService.numberWithCommas(UtilityService.round(gamesPlayed, 0));

        if (isCondensed) {
            return getCondensedCard();
        } else {
            return (
                <Card className={'gamer-card ' + modeClass}>

                    <CardHeader>

                        <Box style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                            <Box style={{width: '85%'}}>
                                <GamerLinkList gamer={gamer} noLink={noLink}/>
                            </Box>

                            {getCardOptions()}
                        </Box>

                        <GamerAliasList gamer={gamer}/>

                        <GamerHeat gamer={gamer}/>

                        <ClassBadgeList subject={gamer}
                                        classDescriptions={classDescriptions}/>

                    </CardHeader>

                    <CardBody>

                        <Box className={'details'}>

                            <LabelValue label={(
                                <Text title={'including kills and deaths in gulag'}>KDR <Small>[last 100]</Small></Text>
                            )}
                                        value={UtilityService.round(gamer.last_100_rolling_average_kdr, 2)}/>

                            <LabelValue label={'Max Kills'}
                                        labelTitle={'Including kills in gulag'}
                                        value={gamer.max_kills}/>

                            <LabelValue label={<Text>Win Rate <Small>(top 10 rate)</Small></Text>}
                                        value={(
                                            <Text>
                                                {overallWinRate} <Small>
                                                ({UtilityService.numberToPercentage(gamer.overall_top_10_rate, 1)})
                                            </Small>
                                            </Text>
                                        )}/>

                            <LabelValue label={(<Text>Last 100 Gulag Win Rate <Small>(KDR)</Small></Text>)}
                                        value={(
                                            <Text>
                                                <Text>
                                                    {gamer.pretty_last_100_gulag_win_rate}
                                                </Text> <Small>
                                                    ({UtilityService.round(gamer.last_100_rolling_average_gulag_kdr, 1)})
                                                </Small>
                                            </Text>
                                        )}/>

                            <LabelValue size={'sm'}
                                        labelTitle={'(Kills + (Assists / 2)) / Deaths'}
                                        label={'KADR [last 100]'}
                                        value={`${UtilityService.round(gamer.last_100_rolling_average_kadr, 2)}`}/>

                            <LabelValue size={'sm'}
                                        labelTitle={'Including kills in gulag'}
                                        label={'Average Kills per Game'}
                                        value={`${UtilityService.round(gamer.avg_kills, 1)}`}/>

                            <LabelValue size={'sm'}
                                        label={'Total Games'}
                                        value={gamesPlayedText}/>
                        </Box>

                    </CardBody>
                </Card>
            );
        }


        function getCondensedCard() {
            return (
                <Card className={'gamer-card ' + modeClass} onClick={onGamerClick && function () {
                    onGamerClick(gamer);
                }}>
                    <CardHeader>
                        <GamerLinkList gamer={gamer} noLink={noLink}/>

                        <GamerAliasList gamer={gamer}/>
                    </CardHeader>

                    <CardBody style={{paddingTop: '5px', paddingBottom: '5px'}}>
                        <Box className={'details'} style={{paddingTop: '5px'}}>

                            <LabelValue size={'sm'}
                                        label={(
                                            <Text title={'including kills and deaths in gulag'}>
                                                KDR <Small>(last 100)</Small>
                                            </Text>
                                        )}
                                        value={UtilityService.round(gamer.last_100_rolling_average_kdr, 2)}/>

                            <LabelValue size={'sm'} label={'Max Kills'} value={gamer.max_kills}/>

                            <LabelValue size={'sm'} label={'Overall Win Rate'} value={overallWinRate}/>

                            <LabelValue size={'sm'} label={'Total Games'}
                                        value={gamesPlayedText}/>

                            <LabelValue size={'sm'} label={(<Text>Gulag Win Rate <Small>(KDR)</Small></Text>)}
                                        value={(
                                            <Text>
                                                {gamer.pretty_gulag_win_rate} <Small>({gamer.gulag_kdr})</Small>
                                            </Text>
                                        )}/>

                        </Box>
                    </CardBody>
                </Card>
            );
        }
    }


    function getLoadingCard() {
        return (
            <Card className={'gamer-card loading'}>
                <CardHeader>
                    <Placeholder block/>
                </CardHeader>

                <CardBody>
                    <Placeholder block style={{width: '100%'}}/>
                </CardBody>
            </Card>
        );
    }



    function getCardOptions() {
        if (UserService.userIsLoggedIn()) {
            const gamerIsFriend = UserService.gamerIsFriend(gamer.platform, gamer.username);
            const gamerIsSelf = UserService.gamerIsSelf(gamer.platform, gamer.username);
            const imageSource = '/assets/images/icons/star-sm-' + (gamerIsFriend ? 'fill' : 'empty') + '.png';
            const title = gamerIsFriend ? 'remove from friends' : 'add to friends';
            const alt = gamerIsFriend ? 'A yellow star, to remove the gamer from your friends list' : 'An empty star, to add the gamer to your friends list';
            const height = 20;
            const style = {
                width: (64 / 60.86 * height) + 'px',
                height: height + 'px'
            };

            if (!gamerIsSelf) {
                return (
                    <Box style={{width: '10%', display: 'flex', justifyContent: 'flex-end'}}>
                        <Image alt={alt}
                               title={title}
                               src={imageSource}
                               style={style}
                               clickHover={true}
                               onClick={() => {
                                   const gamerRelationship = {
                                       user_id: UserService.getUser().user_id,
                                       platform: gamer.platform,
                                       username: gamer.username
                                   };

                                   if (gamerIsFriend) {
                                       GamerRelationshipService.removeGamerRelationship(gamerRelationship).finally(forceUpdate);
                                   } else {
                                       GamerRelationshipService.createGamerRelationship({
                                           ...gamerRelationship,
                                           type: 'friend'
                                       }).finally(forceUpdate);


                                   }
                               }}/>
                    </Box>
                );
            }
        }
    }
}
