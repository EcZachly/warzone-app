import {GetServerSideProps} from 'next'
import React, {useState} from 'react';
import _ from 'lodash';

import {Container, Main, Box, Header, Text, Button, Small, Image} from './../../../components/SimpleComponents';
import {SidebarCompanion, LabelValue, Sidebar} from "../../../components/SmartComponents";
import {
    Page,
    GamerCard,
    GamerGradeChart,
    GamerTimeChart,
    TeammateTable,
    GamerPlatformImage,
    Navbar
} from './../../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function GamerDetail({gamerData, view, hostname}) {
    let {gamer, viewData, errorMessage} = gamerData;
    let tabNames: string[] = ['teammates', 'placements', 'stats', 'time'];
    const [chartState, setChartState] = useState({
        viewData: viewData,
        hostname: hostname,
        gamer: gamer,
        activeTab: view
    });


    const fetchViewData = async (tabId) => {
        let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dataUrl = hostname + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=' + tabId + "&timeZone=" + timeZone;
        console.log(dataUrl);
        const response = await fetch(dataUrl);
        return await response.json();
    }

    const setTabAndFetchData = async (tabId) =>{
        let newState = Object.assign({}, chartState);
        newState.activeTab = tabId;
        if (tabId === chartState.activeTab) {
            //Do nothing since we aren't changing tabs
        } else if (tabId == "placements" && chartState.activeTab == "stats") {
            setChartState(newState);
        } else if (tabId == "stats" && chartState.activeTab == "placements") {
            setChartState(newState);
        } else {
            let fetchedData = await fetchViewData(tabId);
            newState.viewData = fetchedData.viewData;
            setChartState(newState);
        }
    }


    let componentMap = {
        'teammates': <TeammateTable teammates={chartState.viewData}/>,
        'placements': <GamerGradeChart height={260}
                                       width={450}
                                       key={"placement_chart"}
                                       data={chartState.viewData}
                                       options={['solo_placements', 'duo_placements', 'trio_placements', 'quad_placements']}
                                       selectedValue="duo_placements"/>,
        'stats': <GamerGradeChart height={260}
                                  width={450}
                                  key={"stat_chart"}
                                  data={chartState.viewData}
                                  options={['kdr', 'damage', 'kills', 'score']}
                                  selectedValue="kdr"/>,
        'time': <GamerTimeChart height={260}
                                width={450}
                                key={"placement_chart"}
                                viewData={chartState.viewData}
                                options={['hour_of_day', 'day_of_week']}
                                selectedValue="hour_of_day"/>
    }

    let TabData = componentMap[chartState.activeTab]

    let buttonTabs = tabNames.map((tabName) => {
        const isActive = (chartState.activeTab === tabName);
        return (
            <Button type={isActive ? 'purple' : 'light'} onClick={() => isActive ? '' : setTabAndFetchData(tabName)}>
                {_.capitalize(tabName)}
            </Button>
        )
    });

    if (errorMessage) {
        return (
            <div className="container">
                <main>
                    <h1>{errorMessage}</h1>
                </main>
            </div>
        )
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
            </Page>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let {username, platform} = context.query;
    let view = context.query.view || 'teammates';
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view);
    let gamerJson = await rawGamerList.json();
    return {props: {gamerData: gamerJson, view: context.query.view || 'teammates', hostname: process.env.HOSTNAME}}
}
