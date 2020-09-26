import {GetServerSideProps} from 'next'
import React, {useState} from 'react';
import {Container, Main, Box, Button} from './../../../components/SimpleComponents';
import {Page, GamerCard, GamerGradeChart, GamerTimeChart, TeammateTable} from './../../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//
async function setTabAndFetchData(username, platform, tabId, hostname, chartState, setChartState) {
    //Since the placements and stats tabs use the same data, we don't need to make another API call, we can just switch
    // The tabs
    if (tabId == "placements" && chartState.activeTab == "stats") {
        setChartState({viewData: chartState.viewData, activeTab: tabId});
    } else if (tabId == "stats" && chartState.activeTab == "placements") {
        setChartState({viewData: chartState.viewData, activeTab: tabId});
    } else {
        let fetchedData = await fetchViewData(hostname, username, platform, tabId);
        setChartState({viewData: fetchedData.viewData, activeTab: tabId});
    }
}

export default function GamerDetail({gamerData, view}) {
    let HOSTNAME = process.env.HOSTNAME;
    let {gamer, viewData, errorMessage} = gamerData;
    const [chartState, setChartState] = useState({viewData, activeTab:  view});
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
                                <Button
                                    onClick={() => setTabAndFetchData(gamer.username, gamer.platform, "teammates", HOSTNAME, chartState, setChartState)}>Teammates</Button>
                                <Button
                                    onClick={() => setTabAndFetchData(gamer.username, gamer.platform, "placements", HOSTNAME, chartState, setChartState)}>Placements</Button>

                                <Button
                                    onClick={() => setTabAndFetchData(gamer.username, gamer.platform, "stats", HOSTNAME, chartState, setChartState)}>Stats</Button>
                                <Button
                                    onClick={() => setTabAndFetchData(gamer.username, gamer.platform, "time", HOSTNAME, chartState, setChartState)}>Time</Button>
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
    return {props: {gamerData: gamerJson, view: context.query.view || 'teammates'}}
}
