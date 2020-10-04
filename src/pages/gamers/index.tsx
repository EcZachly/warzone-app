import {GetServerSideProps} from 'next'
import React, {useState} from "react";
import InfiniteScroll from 'react-infinite-scroller';

import {Container, Header, LineBreak, Main} from './../../components/SimpleComponents';
import {Page, Navbar, Footer} from './../../components/AppComponents';
import {SidebarCompanion, Input, Sidebar} from '../../components/SmartComponents';
import {GamerCard, GamerAdd} from './../../components/gamer/index';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function Gamers({gamers, hostname, recaptchaSiteKey, limit}) {
    const [usernameSearchValue, updateUsernameSearchValue] = useState('');
    const [gamerValues, setGamers] = useState(gamers);
    const [feedHasMore, setFeedHasMore] = useState(true);
    const tempUsernameSearchValue = usernameSearchValue.toLowerCase();

    const fetchMoreGamers = async (page) => {
        let dataUrl = hostname + '/api/gamers?limit=' + limit + "&offset=" + limit*page
        const response = await fetch(dataUrl);
        let newGamers =  await response.json();
        if(newGamers.length === 0){
            setFeedHasMore(false);
        }
        else{
            let allGamers = [...gamerValues, ...newGamers];
            setGamers(allGamers);
        }
    }

    let gamerList = gamerValues.filter(({username, aliases}) => {
        if (!!usernameSearchValue) {
            const gamerUsernameIncludes = username.toLowerCase().includes(tempUsernameSearchValue);
            const aliasesIncludes = aliases.filter((name) => name.toLowerCase().includes(tempUsernameSearchValue)).length > 0;

            return gamerUsernameIncludes || aliasesIncludes;
        } else {
            return true;
        }
    }).map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>);
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

                        <GamerAdd recaptchaSiteKey={recaptchaSiteKey} hostname={hostname}/>

                        <LineBreak/>

                        <Input type={'text'}
                               value={usernameSearchValue}
                               onChange={(value) => updateUsernameSearchValue(value)}
                               label={'Search'}
                               placeholder={'Username and aliases'}/>
                    </Sidebar>

                    <SidebarCompanion>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={(page)=> fetchMoreGamers(page)}
                            hasMore={feedHasMore}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            useWindow={true}
                        >
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
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return {
        props: {
            offset: 0,
            limit: 10,
            gamers: gamerJson,
            hostname: process.env.HOSTNAME,
            recaptchaSiteKey: process.env.WARZONE_RECAPTCHA_SITE_KEY
        }
    }
}