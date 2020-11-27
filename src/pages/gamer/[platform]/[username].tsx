import {GetServerSideProps} from 'next';
import React, {useState, useEffect} from 'react';
import _ from 'lodash';

import {Container, Main, Box, Header, Text, Button, Small, Image} from './../../../components/SimpleComponents';
import {SidebarCompanion, LabelValue, Sidebar} from '../../../components/SmartComponents';
import {
    Page,
    GamerGradeChart,
    GamerTimeChart,
    TeammateTable,
    GamerPlatformImage,
    Navbar,
    Footer,
    SquadList,
    GamerTrendChart
} from './../../../components/AppComponents';
import UtilityService, {getBaseUrlWithProtocol} from '../../../services/UtilityService';
import {ClassBadgeList} from '../../../components/classes';
import TrendChart from '../../../components/charting/TrendChart';

import {GamerPlacementChart} from './../../../components/gamer/index';
import HtmlService from '../../../services/HtmlService';
import GamerMatchService from '../../../components/gamer_match/GamerMatchService';
import GamerMatchCardList from '../../../components/gamer_match/GamerMatchCardList';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function GamerDetail({gamerData, view, baseUrl}) {

    let containerRef = React.useRef<HTMLDivElement>();

    const {gamer, viewData, errorMessage, classDescriptions} = gamerData;

    const tabNames: string[] = ['teammates', 'placements', 'stats', 'time', 'squads', 'trends', 'recent_matches'];

    const [chartState, setChartState] = useState({
        viewData: viewData,
        baseUrl: baseUrl,
        gamer: gamer,
        activeTab: view
    });

    console.log(chartState.viewData);

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
        'teammates': <TeammateTable teammates={chartState.viewData}/>,

        'placements': <GamerPlacementChart height={260}
                                           width={chartWidth}
                                           data={chartState.viewData[0]}/>,

        'stats': <GamerGradeChart height={260}
                                  width={chartWidth}
                                  key={'stat_chart'}
                                  data={chartState.viewData}
                                  options={['kdr', 'damage', 'kills', 'score']}
                                  selectedValue="kdr"/>,

        'time': <GamerTimeChart height={260}
                                width={chartWidth}
                                key={'placement_chart'}
                                viewData={chartState.viewData}
                                options={['hour_of_day', 'day_of_week']}
                                selectedValue="hour_of_day"/>,

        'squads': <SquadList baseUrl={baseUrl}
                             squads={chartState.viewData}
                             classDescriptions={[]}/>,

        'trends': <GamerTrendChart gamer={gamer}
                                   baseUrl={baseUrl}
                                   height={260}
                                   width={chartWidth}
                                   data={chartState.viewData}/>,

        'recent_matches': <GamerMatchCardList gamer={gamer}
                                       gamerMatchList={chartState.viewData}/>
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
                {UtilityService.camelToProperCase(tabName)}
            </Button>
        );
    });

    if (errorMessage) {
        return (
            <div className="container">
                <main>
                    <h1>{errorMessage}</h1>
                </main>
            </div>
        );
    } else {
        return (
            <Page title={'Stats for ' + gamer.username}>
                <Navbar/>

                <Main>
                    <Container size={'lg'} mode={'sidebar'}>
                        <Sidebar>
                            <Header size={'lg'}>
                                {gamer.username}

                                <Small>
                                    <GamerPlatformImage gamer={gamer}/>
                                </Small>
                            </Header>

                            <LabelValue label={'aliases'} value={gamer.aliases.join(', ')}/>

                            <LabelValue label={'KDR'} value={gamer.kdr}/>

                            <LabelValue label={'Max Kills'} value={gamer.max_kills}/>

                            <LabelValue label={'Gulag Win Rate'} value={gamer.gulag_win_rate}/>

                            <LabelValue label={'Classes'} value={<ClassBadgeList subject={gamer}
                                                                                 classDescriptions={classDescriptions}/>}/>

                        </Sidebar>
                        <SidebarCompanion innerRef={containerRef}>
                            <Box style={{borderBottom: '1px solid #666', marginBottom: '10px'}}>
                                {buttonTabs}
                            </Box>
                            <Box>
                                {TabData}
                            </Box>
                        </SidebarCompanion>
                    </Container>
                </Main>

                <Footer/>
            </Page>
        );
    }



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



    async function fetchViewData(tabId): Promise<{ viewData: Record<any, unknown> }> {
        return new Promise(async (resolve, reject) => {

            if (tabId === 'recent_matches') {
                let response;

                try {
                    response = await GamerMatchService.queryGamerMatches({
                        query_username: gamer.username,
                        query_platform: gamer.platform
                    }, {
                        baseUrl: baseUrl,
                        order: [{
                            field: 'match_id',
                            direction: 'desc',
                            nulls: 'last'
                        }]
                    });
                } catch (error) {
                    response = [{error}];
                }

                resolve({
                    viewData: response
                });
            } else {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const dataUrl = baseUrl + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=' + tabId + '&timeZone=' + timeZone;
                const response = await fetch(dataUrl);
                let finalResponse = await response.json();

                resolve(finalResponse);
            }
        });
    }



    async function setTabAndFetchData(tabId) {
        const newState = Object.assign({}, chartState);

        newState.activeTab = tabId;

        if (tabId === chartState.activeTab) {
            //Do nothing since we aren't changing tabs
        } else if (tabId === 'placements' && chartState.activeTab === 'stats') {
            setChartState(newState);
        } else if (tabId === 'stats' && chartState.activeTab === 'placements') {
            setChartState(newState);
        } else {
            const fetchedData = await fetchViewData(tabId);
            newState.viewData = fetchedData.viewData;
            setChartState(newState);
        }
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, platform, view} = context.query;
    const validViewNames = ['teammates', 'placements', 'stats', 'time', 'squads', 'trends'];
    const selectedView = validViewNames.includes(view as string) ? context.query.view : 'teammates';
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const rawGamerList = await fetch(baseUrl + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + selectedView);
    const gamerJson = await rawGamerList.json();
    return {
        props: {
            gamerData: gamerJson,
            view: selectedView,
            baseUrl: baseUrl
        }
    };
};
