import {GetServerSideProps} from 'next';
import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import {Container, Header, LineBreak, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import {SidebarCompanion, Input, Sidebar} from '../../components/SmartComponents';

import {getBaseUrlWithProtocol} from '../../services/UtilityService';

import {GamerCard, GamerAdd} from './../../components/gamer/index';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({gamers, baseUrl, recaptchaSiteKey, limit, classDescriptions}) {
    const [gamerValues, setGamers] = useState(gamers);
    const [feedHasMore, setFeedHasMore] = useState(true);
    const [searchValue, setSearchValue] = useState("");

    const fetchMoreGamers = async (page) => {
        let searchQuery = '&username.ilike=' + encodeURIComponent('%' + searchValue + '%')
        const dataUrl = baseUrl + '/api/gamer?limit=' + limit + '&offset=' + limit * page + searchQuery;
        const response = await fetch(dataUrl);
        const newGamers = await response.json();
        if (newGamers.gamers.length === 0) {
            setFeedHasMore(false);
        } else {
            const allGamers = [...gamerValues, ...newGamers.gamers];
            setGamers(allGamers);
        }
    };

    const searchGamers = async (inputValue) => {
        setSearchValue(inputValue);
        setGamers([]);
    };


    if(gamerValues.length === 0){
        fetchMoreGamers(0);
    }

    const gamerList = gamerValues.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}
                                                            classDescriptions={classDescriptions}/>);


    return (
        <Page title={'Gamers'}>
            <Navbar/>

            <Main>
                <Container mode={'sidebar'} size={'lg'}>
                    <Sidebar>
                        <Header>All Gamers</Header>

                        <LineBreak/>

                        <GamerAdd recaptchaSiteKey={recaptchaSiteKey} baseUrl={baseUrl}/>

                        <LineBreak/>

                        <Input type={'text'}
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
                            {gamerList}
                        </InfiniteScroll>
                    </SidebarCompanion>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);

    console.log(baseUrl + '/api/gamer');
    const rawGamerList = await fetch(baseUrl + '/api/gamer');
    const gamerJson = await rawGamerList.json();

    return {
        props: {
            offset: 0,
            limit: 10,
            gamers: gamerJson['gamers'],
            classDescriptions: gamerJson['classDescriptions'],
            baseUrl: baseUrl,
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    };
};