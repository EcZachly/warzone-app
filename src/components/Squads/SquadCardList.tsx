import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import {SquadCard} from '../../components/Squads';
import {SquadList} from './SquadTypes';
import {ClassDescriptionMap} from '../classes/ClassTypes';
import UtilityService from '../../services/UtilityService';
import {Input} from '../SmartComponents';
import {Box, LineBreak, Paragraph} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type SquadCardListProps = {
    squads: SquadList,
    baseUrl: string,
    classDescriptions?: Record<any, unknown>[],
    hasMore?: false,
    limit?: 10,
}

export default function SquadCardList(props: SquadCardListProps) {
    const {squads, baseUrl, limit = 10, hasMore = false, classDescriptions = []} = props;

    let orderOptionsList = [
        {
            value: {
                key: 'num_matches',
                descending: true
            },
            text: 'Number of Matches (High to Low)'
        },
        {
            value: {
                key: 'win_percentage',
                descending: true
            },
            text: 'Win Rate (High to Low)'
        },
        {
            value: {
                key: 'avg_placement',
                descending: false
            },
            text: 'Average Placement (Low to High)'
        },
        {
            value: {
                key: 'kdr',
                descending: true
            },
            text: 'Average KDR (High to Low)'
        }
    ];

    const [feedHasMore, setFeedHasMore] = useState(hasMore);
    const [sortOrder, setSortOrder] = useState(orderOptionsList[0].value);
    const [minMatchCount, setMinMatchCount] = useState(5);
    const [squadList, setSquadList] = useState(squads);
    const [showDuos, setShowDuos] = useState(true);
    const [showTrios, setShowTrios] = useState(true);
    const [showQuads, setShowQuads] = useState(true);

    useEffect(() => {
        console.log('sortOrder changed: ', sortOrder);
    }, [sortOrder]);


    useEffect(() => {
        console.log('squadlist changed');
        console.log(squadList);
    }, [squadList]);

    let totalSquadCount = squadList.length;

    let sanitizedSquadList = getSanitizedSquads();
    let sanitizedSquadCount = sanitizedSquadList.length;

    return (
        <InfiniteScroll pageStart={0}
                        loadMore={(page) => fetchMoreSquads(page)}
                        hasMore={feedHasMore}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                        useWindow={true}>

            <Box>
                <Box>
                    <Input type={'select'}
                           label={'Sort'}
                           value={JSON.stringify(sortOrder)}
                           onChange={setSortOrder}
                           options={orderOptionsList}/>
                </Box>

                <Box style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Box>
                        <Input type={'radio'}
                               style={{marginRight: '10px', display: 'flex', marginBottom: 0}}
                               label={'Min Matches'}
                               value={minMatchCount}
                               radioStyle={{marginLeft: '5px', marginRight: '5px'}}
                               options={[
                                   {
                                       value: 1,
                                       text: '1'
                                   },
                                   {
                                       value: 5,
                                       text: '5'
                                   },
                                   {
                                       value: 15,
                                       text: '15'
                                   },
                               ]}
                               onChange={setMinMatchCount}/>
                    </Box>

                    <Box style={{display: 'flex', flexFlow: 'row wrap'}}>
                        <Input type={'checkbox'}
                               style={{marginRight: '10px', marginBottom: 0}}
                               label={'Duos'}
                               value={showDuos}
                               onChange={setShowDuos}/>


                        <Input type={'checkbox'}
                               style={{marginRight: '10px', marginBottom: 0}}
                               label={'Trios'}
                               value={showTrios}
                               onChange={setShowTrios}/>


                        <Input type={'checkbox'}
                               style={{marginRight: '10px', marginBottom: 0}}
                               label={'Quads'}
                               value={showQuads}
                               onChange={setShowQuads}/>
                    </Box>

                    <Box>
                        <Paragraph type={'help'} textRight style={{marginTop: '0'}}>
                            {sanitizedSquadCount} of {totalSquadCount}
                        </Paragraph>
                    </Box>
                </Box>

                <LineBreak style={{marginTop: '0px'}}/>
            </Box>

            {getSanitizedSquads().map((squad, index) => {
                return (
                    <SquadCard key={squad.team_grain + index}
                               squad={squad}
                               classDescriptions={classDescriptions}/>
                );
            })}

        </InfiniteScroll>
    );



    async function fetchMoreSquads(page) {
        const dataUrl = baseUrl + '/api/squad?limit=' + limit + '&offset=' + limit * page;

        const rawResponse = await fetch(dataUrl);
        const response = await rawResponse.json();
        const newSquadList = UtilityService.validateItem(response.squads, 'array', []);

        if (newSquadList.length === 0) {
            setFeedHasMore(false);
        } else {
            const combinedSquads = [...squadList, ...newSquadList];
            setSquadList(combinedSquads);
        }
    }



    function getSanitizedSquads() {
        let _squadList = UtilityService.copyObject(squadList);

        if (minMatchCount) {
            _squadList = _squadList.filter((squad) => squad.num_matches >= minMatchCount);
        }

        let allowedTeams = [
            showDuos && 'duo',
            showTrios && 'trio',
            showQuads && 'quad'
        ].filter((value) => !!value);

        _squadList = _squadList.filter((squad) => allowedTeams.includes(squad.team_type));

        return UtilityService.sortArrayOfObjectsByKey(_squadList, sortOrder.key, sortOrder.descending);
    }

}