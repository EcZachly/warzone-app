import {GetServerSideProps} from 'next';
import React, {useState} from 'react';
import _ from 'lodash';

import {Container, Main, Box, Header, Text, Button, Small, Image} from './../../../components/SimpleComponents';
import {SidebarCompanion, LabelValue, Sidebar} from '../../../components/SmartComponents';
import {
    Page,
    GamerGradeChart,
    GamerTimeChart,
    TeammateTable,
    GamerPlatformImage,
    Navbar, Footer, SquadList
} from './../../../components/AppComponents';
import {getBaseUrlWithProtocol} from '../../../services/UtilityService';
import {ClassBadgeList} from "../../../components/classes";

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function GamerDetail({gamerData, view, baseUrl}) {

    const {gamer, viewData, errorMessage, classDescriptions} = gamerData;

    const tabNames: string[] = ['teammates', 'placements', 'stats', 'time', 'squads'];

    console.log(viewData);
    const [chartState, setChartState] = useState({
        viewData: viewData,
        baseUrl: baseUrl,
        gamer: gamer,
        activeTab: view
    });


    const fetchViewData = async (tabId) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dataUrl = baseUrl + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=' + tabId + '&timeZone=' + timeZone;
        const response = await fetch(dataUrl);
        return await response.json();
    };

    const setTabAndFetchData = async (tabId) => {
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
            console.log(fetchedData);
            setChartState(newState);
        }
    };

    let windowWidth = 0;

    try {
        windowWidth = window && window.innerWidth ? window.innerWidth : 0;
    } catch (e) {

    }

    const maxWidth = 550;
    const chartSidePadding = 25 * 2;
    const chartWidth = ((windowWidth > 0 && windowWidth > maxWidth) ? maxWidth : windowWidth) - (chartSidePadding);


    const componentMap = {
        'teammates': <TeammateTable teammates={chartState.viewData}/>,

        'placements': <GamerGradeChart height={260}
                                       width={chartWidth}
                                       key={'placement_chart'}
                                       data={chartState.viewData}
                                       options={['solo_placements', 'duo_placements', 'trio_placements', 'quad_placements']}
                                       selectedValue="duo_placements"/>,

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
        'squads': <SquadList baseUrl={baseUrl} squads={chartState.viewData} classDescriptions={[]} />
    };

    const TabData = componentMap[chartState.activeTab];

    const buttonTabs = tabNames.map((tabName) => {
        const isActive = (chartState.activeTab === tabName);
        return (
            <Button key={tabName} type={isActive ? 'purple' : 'light'}
                    onClick={() => isActive ? '' : setTabAndFetchData(tabName)}>
                {_.capitalize(tabName)}
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
                            <ClassBadgeList subject={gamer} classDescriptions={classDescriptions}/>
                        </Sidebar>
                        <SidebarCompanion>
                            <Box>
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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, platform, view} = context.query;
    const validViewNames = ['teammates', 'placements', 'stats', 'time', 'squads'];
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
