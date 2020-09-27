import {GetServerSideProps} from 'next'
import React, {useState} from 'react';
import {Container, Main, Box, Button} from './../../../components/SimpleComponents';
import {Page, GamerCard, GamerGradeChart, GamerTimeChart, TeammateTable} from './../../../components/AppComponents';
import _ from 'lodash';
//===---==--=-=--==---===----===---==--=-=--==---===----//
async function setTabAndFetchData(tabId, chartState, setChartState) {
    //Since the placements and stats tabs use the same data, we don't need to make another API call, we can just switch
    // The tabs
    let newState = Object.assign({}, chartState);
    newState.activeTab = tabId;
    if(tabId === chartState.activeTab){
        //Do nothing since we aren't changing tabs
    }
    else if (tabId == "placements" && chartState.activeTab == "stats") {
        setChartState(newState);
    } else if (tabId == "stats" && chartState.activeTab == "placements") {
        setChartState(newState);
    } else {
        let fetchedData = await fetchViewData(chartState.hostname, chartState.gamer.username, chartState.gamer.platform, tabId);
        newState.viewData =  fetchedData.viewData;
        setChartState(newState);
    }
}

export default function GamerDetail({gamerData, view, hostname}) {
    let {gamer, viewData, errorMessage} = gamerData;
    const [chartState, setChartState] = useState({viewData: viewData, hostname:hostname, gamer:gamer, activeTab: view});
    let allTabs: string[] = ['teammates', 'placements', 'stats', 'time'];
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

    let buttonTabs = allTabs.map((tab)=> <Button
        onClick={() => setTabAndFetchData(tab, chartState, setChartState)}>{_.capitalize(tab)}</Button>
    )
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
                <Container>
                    <Main>
                        <GamerCard gamer={gamer}/>
                        <Box style={{"margin": "auto"}}>
                            <Container>
                                {buttonTabs}
                            </Container>
                            <section>
                                {TabData}
                            </section>
                        </Box>
                    </Main>
                </Container>
            </Page>
        )
    }
}

async function fetchViewData(hostname, username, platform, view) {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dataUrl =  hostname + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view + "&timeZone=" + timeZone;
    const response = await fetch(dataUrl);
    return await response.json();
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    let {username, platform} = context.query;
    let view = context.query.view || 'teammates';
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view);
    let gamerJson = await rawGamerList.json();
    return {props: {gamerData: gamerJson, view: context.query.view || 'teammates', hostname: process.env.HOSTNAME}}
}
