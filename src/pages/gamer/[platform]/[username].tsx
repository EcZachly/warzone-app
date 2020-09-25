import Head from 'next/head'
import {GetServerSideProps} from 'next'
import GamerCard from "../../../components/gamer/gamer_card";
import GamerGradeChart from "../../../components/gamer/gamer_grade_chart";
import {Tab, Tabs} from 'react-mdl/lib/Tabs';
import React, {useState} from 'react';

import {Container, Header, Main, Box} from './../../../components/SimpleComponents';
import {Page} from './../../../components/AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

async function setTabAndFetchData(username, platform, tabId, chartState, setChartState) {
    if (tabId == 1 && chartState.activeTab == 2) {
        console.log(chartState);
        setChartState({viewData: chartState.viewData, activeTab: tabId});
    } else if (tabId == 2 && chartState.activeTab == 1) {
        setChartState({viewData: chartState.viewData, activeTab: tabId});
    } else {
        let lookup = {
            0: 'teammate_analysis',
            1: 'gamer_stats_graded',
            2: 'gamer_stats_graded',
            3: 'time_of_day_analysis'
        }

        let fetchedData = await fetchViewData(username, platform, lookup[tabId]);

        setChartState({viewData: fetchedData.viewData, activeTab: tabId});
    }
}

export default function Gamers({gamerData, view}) {
    let {gamer, viewData, errorMessage} = gamerData;
    let tabLookup = {
        'teammates': 0,
        'placements': 1,
        'stats': 2,
        'time_of_day': 3
    }

    const [chartState, setChartState] = useState({viewData, activeTab: tabLookup[view]});
    let componentMap = {
        0: <h1>Not yet done!</h1>,
        1: <GamerGradeChart key={"placement_chart"} data={chartState.viewData}
                            options={['solo_placements', 'duo_placements', 'trio_placements', 'quad_placements']}
                            selectedValue="duo_placements"/>,
        2: <GamerGradeChart key={"stat_chart"} data={chartState.viewData} options={['kdr', 'damage', 'kills', 'score']}
                            selectedValue="kdr"/>,
        3: <h1>Not yet done!</h1>
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
            <Page title={gamer.username}>
                <Container>
                    <Main>
                        <GamerCard gamer={gamer}/>
                        <Box style={{"margin": "auto"}}>
                            <Tabs activeTab={chartState.activeTab}
                                  onChange={(tabId) => setTabAndFetchData(gamer.username, gamer.platform, tabId, chartState, setChartState)}
                                  ripple>
                                <Tab>Teammates</Tab>
                                <Tab>Placements</Tab>
                                <Tab>Stats</Tab>
                                <Tab>Time</Tab>
                            </Tabs>

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

async function fetchViewData(username, platform, view) {
    //TODO MAKE THIS WORK ON HEROKU TOO
    let dataUrl = 'https://localhost:3000/api/gamer/' + platform + '/' + username + '?view=' + view;
    console.log(dataUrl);
    const response = await fetch(dataUrl);
    return await response.json();
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    let viewMap = {
        'teammates': 'teammate_analysis',
        'placements': 'gamer_stats_graded',
        'stats': 'gamer_stats_graded',
        'time_of_day': 'time_of_day_analysis'
    };

    let {username, platform} = context.query;
    let view = viewMap[context.query.view as string] || 'teammate_analysis';
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamer/' + platform + '/' + username + '?view=' + view);
    let gamerJson = await rawGamerList.json();
    return {props: {gamerData: gamerJson, view: context.query.view || 'teammates'}}
}
