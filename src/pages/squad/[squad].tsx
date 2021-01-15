import {GetServerSideProps} from 'next';
import React, {useEffect, useState} from 'react';
import _ from 'lodash';

import {Box, Button, Container, LineBreak, Main, Show} from './../../components/SimpleComponents';
import {LabelValue, Sidebar, SidebarCompanion} from '../../components/SmartComponents';
import {Footer, Navbar, Page,} from './../../components/AppComponents';

import {SquadService} from './../../components/Squads/index';

import {getBaseUrlWithProtocol} from '../../services/UtilityService';
import {ClassBadgeList} from '../../components/classes';


import {GamerLinkList} from './../../components/gamer/index';
import HtmlService from '../../services/HtmlService';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function SquadDetail({squadData, errorMessage, view, baseUrl}) {
    console.log(errorMessage);
    let containerRef = React.useRef<HTMLDivElement>();

    const {squads, viewData, classDescriptions} = squadData;
    const squad = squads[0];
    const squadExists = !!squad;

    if (!squadExists) {
        errorMessage = 'No squad was found';
    }

    let squadGamers = squad.gamers.map((gamerUsernameID) => {
        let [platform, username] = gamerUsernameID.split('-');
        return {platform, username};
    });
    const pageTitle = (errorMessage) ? 'error' : 'Stats for Squad: ' + squadGamers.map(({username}) => username).join(', ');

    const tabNames: string[] = ['teammates', 'placements', 'stats', 'time', 'squads', 'trends'];

    const [chartState, setChartState] = useState({
        viewData: viewData,
        baseUrl: baseUrl,
        squad: squad,
        activeTab: view
    });

    const [_componentDidUpdate, setComponentDidUpdate] = useState(false);

    useEffect(() => {
        componentDidUpdate();
    });


    function componentDidUpdate() {
        console.log('componentDidUpdate');
        setComponentDidUpdate(true);
    }


    const chartWidth = getChartWidth();

    const componentMap = {
        // 'teammates': <TeammateTable teammates={chartState.viewData}/>,
        //
        // 'placements': <GamerPlacementChart height={260}
        //                                    width={chartWidth}
        //                                    data={chartState.viewData[0]}/>,
        //
        // 'stats': <GamerGradeChart height={260}
        //                           width={chartWidth}
        //                           key={'stat_chart'}
        //                           data={chartState.viewData}
        //                           options={['kdr', 'damage', 'kills', 'score']}
        //                           selectedValue="kdr"/>,
        //
        // 'time': <GamerTimeChart height={260}
        //                         width={chartWidth}
        //                         key={'placement_chart'}
        //                         viewData={chartState.viewData}
        //                         options={['hour_of_day', 'day_of_week']}
        //                         selectedValue="hour_of_day"/>,
        //
        // 'squads': <SquadList baseUrl={baseUrl} squads={chartState.viewData} classDescriptions={[]}/>,
        //
        // 'trends': <GamerTrendChart gamer={gamer}
        //                            baseUrl={baseUrl}
        //                            height={260}
        //                            width={chartWidth}
        //                            data={chartState.viewData}/>
    };

    const TabData = componentMap[chartState.activeTab];

    const buttonTabs = tabNames.map((tabName) => {
        const isActive = (chartState.activeTab === tabName);
        return (
            <Button key={tabName}
                    type={isActive ? 'dark' : 'link'}
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0
                    }}
                    onClick={() => isActive ? '' : setTabAndFetchData(tabName)}>
                {_.capitalize(tabName)}
            </Button>
        );
    });

    return (
        <Page title={pageTitle}>
            <Navbar/>

            <Main>
                <Container size={'lg'} mode={'sidebar'}>

                    <Show show={!errorMessage}>
                        <Sidebar>
                            <GamerLinkList gamers={squadGamers} block/>

                            <LineBreak/>

                            <LabelValue label={'Games Played'} value={squad.num_matches}/>

                            <LabelValue label={'Total Wins'} value={squad.total_wins}/>

                            <LabelValue label={'Win Rate'} value={(squad.win_percentage).toFixed(1) + '%'}/>

                            <LabelValue label={'Gulag Win Rate'} value={squad.pretty_gulag_win_rate}/>

                            <LabelValue label={'Classes'} value={<ClassBadgeList subject={squad}
                                                                                 classDescriptions={classDescriptions}/>}/>

                        </Sidebar>
                        <SidebarCompanion innerRef={containerRef}>
                            <Box style={{borderBottom: '1px solid #666', marginBottom: '10px'}}>
                                {buttonTabs}
                            </Box>
                            {/*<Box>*/}
                            {/*    {TabData}*/}
                            {/*</Box>*/}
                        </SidebarCompanion>
                    </Show>



                    <Show show={!!errorMessage}>
                        <h1>{errorMessage}</h1>
                    </Show>
                </Container>
            </Main>

            <Footer/>
        </Page>
    );



    function getChartWidth() {
        let windowWidth = 0;
        let containerPosition;

        try {
            windowWidth = window && window.innerWidth ? window.innerWidth : 0;
        } catch (e) {

        }

        try {
            containerPosition = HtmlService.getElementPosition(containerRef.current);
        } catch (e) {

        }

        const maxWidth = containerPosition.width || 600;
        const chartSidePadding = 15 * 2;
        return ((windowWidth > 0 && windowWidth > maxWidth) ? maxWidth : windowWidth) - (chartSidePadding);
    }



    async function fetchViewData(tabId) {
        // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // const dataUrl = baseUrl + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=' + tabId + '&timeZone=' + timeZone;
        // const response = await fetch(dataUrl);
        // return await response.json();
    }



    async function setTabAndFetchData(tabId) {
        // const newState = Object.assign({}, chartState);
        //
        // newState.activeTab = tabId;
        //
        // if (tabId === chartState.activeTab) {
        //     //Do nothing since we aren't changing tabs
        // } else if (tabId === 'placements' && chartState.activeTab === 'stats') {
        //     setChartState(newState);
        // } else if (tabId === 'stats' && chartState.activeTab === 'placements') {
        //     setChartState(newState);
        // } else {
        //     const fetchedData = await fetchViewData(tabId);
        //     newState.viewData = fetchedData.viewData;
        //     setChartState(newState);
        // }
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {squad, view} = context.query;

    const validViewNames = ['teammates', 'placements', 'stats', 'time', 'squads', 'trends'];
    const selectedView = validViewNames.includes(view as string) ? context.query.view : 'teammates';

    const baseUrl = getBaseUrlWithProtocol(context.req);
    let squadList = [];
    let errorMessage = null;

    try {
        squadList = await SquadService.querySquads({
            team_grain: squad as string
        }, {baseUrl: baseUrl});
    } catch (queryError) {
        console.error(queryError);
        errorMessage = queryError.message;
    }

    console.log(squadList);

    return {
        props: {
            squadData: {
                squads: squadList
            },
            errorMessage: errorMessage,
            view: selectedView,
            baseUrl: baseUrl
        }
    };
};
