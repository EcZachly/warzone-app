import {GetServerSideProps} from 'next';
import React, {useState, useEffect} from 'react';
import {
    Container,
    Main,
    Box,
    Header,
    Text,
    Show,
    LineBreak,
    Button,
    Small
} from './../../../components/SimpleComponents';
import {SidebarCompanion, LabelValue, StatLabelValue, Sidebar} from '../../../components/SmartComponents';
import {
    Page,
    GamerGradeChart,
    ClassBadgeList,
    GamerAliasList,
    GamerHeat,
    GamerPlacementChart,
    GamerTimeChart,
    TeammateTable,
    GamerPlatformImage,
    Navbar,
    Footer,
    GamerTrendChart, GamerInfluenceList
} from './../../../components/AppComponents';

import UtilityService, {getBaseUrlWithProtocol} from '../../../services/UtilityService';
import HtmlService from '../../../services/HtmlService';
import GamerMatchCardList from '../../../components/gamer_match/GamerMatchCardList';
import {SquadCardList} from './../../../components/Squads';
import TypeService from '../../../services/TypeService';

import {COLORS} from '../../../config/CONSTANTS';

const CONFIG = {
    VIEW_NAME_CONFIG: {
        teammates: {},
        placements: {},
        stats: {},
        time: {},
        squads: {},
        trends: {},
        recent_matches: {customGet: true},
        relationships: {}
    }
};

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function GamerDetail({gamerData, view, baseUrl}) {

    let containerRef = React.useRef<HTMLDivElement>();

    const {gamer, viewData, errorMessage, classDescriptions} = gamerData;

    const tabNames = Object.keys(CONFIG.VIEW_NAME_CONFIG);

    const [chartState, setChartState] = useState({
        viewData: viewData,
        baseUrl: baseUrl,
        gamer: gamer,
        activeTab: view
    });

    let overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    let gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);
    const [_componentDidUpdate, setComponentDidUpdate] = useState(false);

    useEffect(() => {
        componentDidUpdate();
    });


    function componentDidUpdate() {
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

        'squads': <SquadCardList baseUrl={baseUrl}
                                 squads={chartState.viewData}
                                 classDescriptions={[]}/>,

        'trends': <GamerTrendChart gamer={gamer}
                                   baseUrl={baseUrl}
                                   height={260}
                                   width={chartWidth}
                                   data={chartState.viewData}/>,

        'recent_matches': <GamerMatchCardList gamer={gamer}
                                              noLink={true}
                                              gamerMatchList={chartState.viewData}/>,
        'relationships': <GamerInfluenceList gamer={gamer} viewData={chartState.viewData}/>
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
        const damageDoneRatio = UtilityService.round(Number(gamer.avg_damage_done) / Number(gamer.avg_damage_taken), 3);
        // const last100GamesPercentageDifference = UtilityService.numberToPercentage((gamer.last_100_rolling_average_kdr - gamer.kdr) / gamer.kdr, 1);
        const last30GamesPercentageDifference = UtilityService.numberToPercentage((gamer.last_30_rolling_average_kdr - gamer.last_100_rolling_average_kdr) / gamer.last_100_rolling_average_kdr, 1);
        const last10GamesPercentageDifference = UtilityService.numberToPercentage((gamer.last_10_rolling_average_kdr - gamer.last_100_rolling_average_kdr) / gamer.last_100_rolling_average_kdr, 1);

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

                            <GamerHeat gamer={gamer}/>

                            <GamerAliasList gamer={gamer}/>

                            <LabelValue label={'Classes'} value={<ClassBadgeList subject={gamer}
                                                                                 classDescriptions={classDescriptions}/>}/>

                            <LineBreak/>

                            <LabelValue style={{marginBottom: '15px'}} label={'KDR'} value={
                                <>
                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'All Games'}
                                                    statValue={gamer.kdr}
                                    />

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 100 games'}
                                                    statValue={gamer.last_100_rolling_average_kdr}
                                    />

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 30 games'}
                                                    statValue={gamer.last_30_rolling_average_kdr}
                                                    compareStatValue={gamer.last_100_rolling_average_kdr}
                                                    compareStatLabel={'compared to the last 100 games'}
                                    />

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 10 games'}
                                                    statValue={gamer.last_10_rolling_average_kdr}
                                                    compareStatValue={gamer.last_100_rolling_average_kdr}
                                                    compareStatLabel={'compared to the last 100 games'}
                                    />
                                </>
                            }/>

                            <LabelValue label={'Average Kills / Deaths per game'}
                                        value={`${UtilityService.round(gamer.avg_kills, 2)} / ${UtilityService.round(gamer.avg_deaths, 2)}`}/>

                            <LabelValue label={'Damage Done/Taken Ratio'} value={damageDoneRatio}/>

                            <LabelValue label={'Max Kills'} value={gamer.max_kills}/>

                            <LabelValue label={'Overall Win Rate'} value={overallWinRate}/>

                            <LabelValue label={'Total Games'} value={gamesPlayed}/>

                            <LabelValue label={'Gulag Win Rate'} value={gamer.gulag_win_rate}/>

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


    async function fetchViewData(tabId): Promise<{ viewData: Record<any, unknown> }> {
        return new Promise(async (resolve, reject) => {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const dataUrl = baseUrl + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=' + tabId + '&timeZone=' + timeZone;
            const response = await fetch(dataUrl);
            let finalResponse = await response.json();

            resolve(finalResponse);
        });
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, platform, view} = context.query;
    const validViewNames = Object.keys(CONFIG.VIEW_NAME_CONFIG);
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