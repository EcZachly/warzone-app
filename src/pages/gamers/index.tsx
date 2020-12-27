import {GetServerSideProps} from 'next';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useRouter} from 'next/router';

import {Box, Container, Header, LineBreak, Main} from './../../components/SimpleComponents';
import {Footer, GamerCategorySelect, Navbar, Page} from './../../components/AppComponents';
import {Input, Sidebar, SidebarCompanion} from '../../components/SmartComponents';

import UtilityService, {getBaseUrlWithProtocol} from '../../services/UtilityService';

import {GamerAdd} from './../../components/gamer/index';
import GamerCardList from '../../components/gamer/GamerCardList';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({
                                   gamers,
                                   baseUrl,
                                   recaptchaSiteKey,
                                   sort,
                                   username,
                                   limit,
                                   classDescriptions,
                                   gameCategory
                               }) {
    const [gamerValues, setGamers] = useState({[gameCategory]: gamers});
    const [feedHasMore, setFeedHasMore] = useState(username.length == 0);
    const [searchValue, setSearchValue] = useState(username);
    const [sorting, updateSorting] = useState(sort);
    const [filterCategory, setGameCategory] = useState(gameCategory);

    useEffect(() => {
        console.log('sorting value changed');
        fetchMoreGamers(0, filterCategory, true);

    }, [sorting]);

    const router = useRouter();

    if (!gamerValues[filterCategory] || gamerValues[filterCategory].length === 0) {
        fetchMoreGamers(0, filterCategory, true);
    }


    const buttonTabs = <GamerCategorySelect activeCategory={filterCategory} setCategory={setGameCategory}/>;

    return (
        <Page title={'Gamers'}>
            <Navbar/>

            <Main>
                <Container mode={'sidebar'} size={'lg'}>
                    <Sidebar>
                        <Header>
                            All Gamers
                        </Header>

                        <LineBreak/>

                        <GamerAdd recaptchaSiteKey={recaptchaSiteKey} baseUrl={baseUrl}/>

                        <LineBreak/>

                        <Input type={'text'}
                               value={searchValue}
                               onChange={(value) => searchGamers(value)}
                               label={'Search'}
                               placeholder={'Username and aliases'}/>

                    </Sidebar>

                    <SidebarCompanion>
                        <Box>
                            <Input onChange={(value) => {
                                updateSorting({...value});
                            }}
                                   type={'select'}
                                   label={'Sort'}
                                   options={[
                                       {
                                           value: {sort: 'last_100_rolling_average_kdr', direction: 'desc'},
                                           text: 'KDR (High to Low)'
                                       },
                                       {
                                           value: {sort: 'last_100_rolling_average_kdr', direction: 'asc'},
                                           text: 'KDR (Low to High)'
                                       },
                                       {
                                           value: {sort: 'gulag_win_rate', direction: 'desc'},
                                           text: 'Gulag Win Rate (High to Low)'
                                       },
                                       {
                                           value: {sort: 'gulag_win_rate', direction: 'asc'},
                                           text: 'Gulag Win Rate (Low to High)'
                                       },
                                       {
                                           value: {sort: 'win_percentage', direction: 'desc'},
                                           text: 'Win Rate (High to Low)'
                                       },
                                       {
                                           value: {sort: 'win_percentage', direction: 'asc'},
                                           text: 'Win Rate (Low to High)'
                                       }
                                   ]}/>
                            <div>
                                {buttonTabs}
                            </div>
                        </Box>


                        <InfiniteScroll pageStart={0}
                                        loadMore={(page) => fetchMoreGamers(page, filterCategory)}
                                        hasMore={feedHasMore}
                                        loader={<div className="loader" key={0}>Loading ...</div>}
                                        useWindow={true}>


                            <GamerCardList gamers={gamerValues[filterCategory] || []}
                                           classDescriptions={classDescriptions.filter((d) => d['game_category'] == filterCategory)[0]}/>

                        </InfiniteScroll>
                    </SidebarCompanion>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );


    async function searchGamers(inputValue) {
        if (inputValue.length == 0) {
            setFeedHasMore(true);
        }
        if (inputValue.length) {
            router.replace({
                pathname: '/gamers',
                query: {username: inputValue, game_category: filterCategory}
            });
        } else {
            router.replace({
                pathname: '/gamers',
                query: {game_category: filterCategory}
            });
        }

        setFeedHasMore(false);
        setSearchValue(inputValue);
        setGamers([]);

    }


    async function fetchMoreGamers(page: number = 0, category = 'Warzone', restart?: boolean) {
        let searchQueryParams = {
            limit,
            game_category: category,
            offset: limit * page,
            sort: sorting.sort,
            direction: sorting.direction
        };

        if (searchValue) {
            searchQueryParams['username.ilike'] = `%${searchValue}%`;
        }
        const dataUrl = baseUrl + '/api/gamer?' + UtilityService.objectToUrlParameters(searchQueryParams);

        const rawResponse = await fetch(dataUrl);
        const response = await rawResponse.json();
        let newGamerList = response.gamers;

        if (newGamerList.length === 0) {
            setFeedHasMore(false);
        } else {
            const filteredGamers = [];
            let totalGamers = [...(gamerValues[category] || []), ...newGamerList];

            if (restart === true) {
                totalGamers = newGamerList;
            }

            let seenGamerTags = {};

            totalGamers.forEach((gamer) => {
                let gamerTag = gamer['platform'] + '-' + gamer['username'];

                if (!seenGamerTags[gamerTag]) {
                    filteredGamers.push(gamer);
                    seenGamerTags[gamerTag] = true;
                }
            });
            let copyGamers = JSON.parse(JSON.stringify(gamerValues));
            copyGamers[filterCategory] = filteredGamers;
            setGamers(copyGamers);
            setGameCategory(category);
        }
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const query = context.query;

    const baseUrl = getBaseUrlWithProtocol(context.req);
    let username = query.username || '';

    let gameCategory = query['game_category'] || 'Warzone';
    const sort = query.sort || 'last_100_rolling_average_kdr';

    const sortDirection = query.direction || 'desc';

    let searchQueryParams = {
        sort: undefined,
        direction: undefined,
        'username.ilike': undefined,
        game_category: gameCategory as string
    };

    if (username) {
        searchQueryParams['username.ilike'] = `%${username}%`;
    }

    if (sort) {
        searchQueryParams.sort = sort;
        searchQueryParams.direction = sortDirection;
    }

    let url = baseUrl + '/api/gamer?' + UtilityService.objectToUrlParameters(searchQueryParams);
    const rawGamerList = await fetch(url);
    const gamerJson = await rawGamerList.json();

    return {
        props: {
            offset: 0,
            limit: 10,
            sort: {
                sort: sort,
                direction: sortDirection
            },
            gamers: gamerJson['gamers'],
            gameCategory: gameCategory,
            username: context.query.username || '',
            classDescriptions: gamerJson['classDescriptions'],
            baseUrl: baseUrl,
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    };
};