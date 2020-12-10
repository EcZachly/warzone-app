import {GetServerSideProps} from 'next';
import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useRouter} from 'next/router';

import {Container, Header, LineBreak, Main, Button} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import {SidebarCompanion, Input, Sidebar} from '../../components/SmartComponents';

import {getBaseUrlWithProtocol} from '../../services/UtilityService';

import {GamerCard, GamerAdd} from './../../components/gamer/index';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({gamers, baseUrl, recaptchaSiteKey, username, limit, classDescriptions}) {
    const [gamerValues, setGamers] = useState(gamers);
    const [feedHasMore, setFeedHasMore] = useState(true);
    const [searchValue, setSearchValue] = useState(username);
    const router = useRouter();



    if (gamerValues.length === 0) {
        fetchMoreGamers(0);
    }


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
                               onChange={searchGamers}
                               label={'Search'}
                               placeholder={'Username and aliases'}/>

                    </Sidebar>

                    <SidebarCompanion>
                        <InfiniteScroll pageStart={0}
                                        loadMore={(page) => fetchMoreGamers(page)}
                                        hasMore={feedHasMore}
                                        loader={<div className="loader" key={0}>Loading ...</div>}
                                        useWindow={true}>

                            {
                                gamerValues.map((gamer) => {
                                    return (
                                        <GamerCard key={gamer.username + '-' + gamer.platform}
                                                   gamer={gamer}
                                                   classDescriptions={classDescriptions}/>
                                    );
                                })
                            }

                        </InfiniteScroll>
                    </SidebarCompanion>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    async function searchGamers(inputValue) {
        if (inputValue.length) {
            router.replace({
                pathname: '/gamers',
                query: {username: inputValue}
            });
        } else {
            router.replace({
                pathname: '/gamers'
            });
        }

        setSearchValue(inputValue);
        setGamers([]);
    }



    async function fetchMoreGamers(page) {
        let searchQuery = '&username.ilike=' + encodeURIComponent('%' + searchValue + '%');
        const dataUrl = baseUrl + '/api/gamer?limit=' + limit + '&offset=' + limit * page + searchQuery;

        const response = await fetch(dataUrl);
        const newGamers = await response.json();

        if (newGamers.gamers.length === 0) {
            setFeedHasMore(false);
        } else {
            const allGamers = [...gamerValues, ...newGamers.gamers];
            setGamers(allGamers);
        }
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);
    let username = context.query.username || '';
    let searchQuery = !!username ? '?username.ilike=' + encodeURIComponent('%' + username + '%') : '';
    const rawGamerList = await fetch(baseUrl + '/api/gamer' + searchQuery);
    const gamerJson = await rawGamerList.json();
    return {
        props: {
            offset: 0,
            limit: 10,
            gamers: gamerJson['gamers'],
            username: context.query.username || '',
            classDescriptions: gamerJson['classDescriptions'],
            baseUrl: baseUrl,
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    };
};