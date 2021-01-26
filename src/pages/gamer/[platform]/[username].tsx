import {GetServerSideProps} from 'next';
import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Paragraph,
    Container,
    Header,
    LineBreak,
    Main,
    Small
} from './../../../components/SimpleComponents';
import {LabelValue, Sidebar, SidebarCompanion, StatLabelValue, TabNav} from '../../../components/SmartComponents';
import {
    ClassBadgeList,
    Footer,
    GamerAliasList,
    GamerGradeChart,
    GamerHeat,
    GamerInfluenceList,
    GamerPlacementChart,
    GamerPlatformImage,
    GamerTimeChart,
    GamerTrendChart,
    Navbar,
    Page
} from './../../../components/AppComponents';

import UtilityService, {getBaseUrlWithProtocol} from '../../../services/UtilityService';
import HtmlService from '../../../services/HtmlService';
import GamerMatchCardList from '../../../components/gamer_match/GamerMatchCardList';
import {SquadCardList} from './../../../components/Squads';
import TypeService from '../../../services/TypeService';
import {GAME_CATEGORIES} from '../../../../lib/constants';
import {GamerService} from '../../../components/gamer';


const CONFIG = {
    VIEW_NAME_CONFIG: {
        // overview: (gamer, chartState) => {
        //     console.log(gamer);
        //
        //     return (
        //         <Box>
        //             <Header size={'md'}>Overall</Header>
        //
        //             <LabelValue label={'Average Placement'} value={UtilityService.round(gamer.avg_placement, 1)}/>
        //
        //
        //             <Header size={'md'}>Solos</Header>
        //
        //             <LabelValue label={'Average Placement'} value={UtilityService.round(gamer.avg_solo_placement, 1)}/>
        //
        //             <LabelValue label={'Win Rate'} value={UtilityService.numberToPercentage(gamer.solo_win_rate, 1)}/>
        //
        //             <Header size={'md'}>Duos</Header>
        //
        //             <LabelValue label={'Average Placement'} value={UtilityService.round(gamer.avg_duo_placement, 1)}/>
        //
        //             <LabelValue label={'Win Rate'} value={UtilityService.numberToPercentage(gamer.duo_win_rate, 1)}/>
        //
        //
        //             <Header size={'md'}>Trios</Header>
        //
        //             <LabelValue label={'Average Placement'} value={UtilityService.round(gamer.avg_trio_placement, 1)}/>
        //
        //             <LabelValue label={'Win Rate'} value={UtilityService.numberToPercentage(gamer.trio_win_rate, 1)}/>
        //
        //
        //             <Header size={'md'}>Quads</Header>
        //
        //             <LabelValue label={'Average Placement'} value={UtilityService.round(gamer.avg_quad_placement, 1)}/>
        //
        //             <LabelValue label={'Win Rate'} value={UtilityService.numberToPercentage(gamer.quad_win_rate, 1)}/>
        //
        //
        //             <LabelValue label={'Matches'} value={UtilityService.numberToPercentage(gamer.quad_match_count, 1)}/>
        //
        //             <LabelValue label={'Wins'} value={UtilityService.numberToPercentage(gamer.quad_wins, 1)}/>
        //
        //             <LabelValue label={'Top 10 Rate'} value={UtilityService.numberToPercentage(gamer.quad_top_10_rate, 1)}/>
        //
        //             <LabelValue label={'Top 10% Rate'} value={UtilityService.numberToPercentage(gamer.quad_top_10_percent_rate, 1)}/>
        //
        //             <LabelValue label={'Last 100 KDR'} value={UtilityService.numberToPercentage(gamer.last_100_quad_rolling_kdr, 1)}/>
        //
        //             <LabelValue label={'Max Kills'} value={UtilityService.numberToPercentage(gamer.quad_max_kills, 1)}/>
        //         </Box>
        //     );
        // },

        teammates: (gamer, chartState) => <GamerInfluenceList gamer={gamer}
                                                              teammateRows={chartState.viewData}/>,

        placements: (gamer, chartState) => <GamerPlacementChart height={260}
                                                                width={chartState.width}
                                                                data={chartState.viewData[0]}/>,

        time: (gamer, chartState) => <GamerTimeChart height={260}
                                                     width={chartState.width}
                                                     key={'placement_chart'}
                                                     viewData={chartState.viewData}
                                                     options={['hour_of_day', 'day_of_week']}
                                                     selectedValue="hour_of_day"/>,

        squads: (gamer, chartState) => <SquadCardList baseUrl={chartState.baseUrl}
                                                      squads={chartState.viewData}
                                                      classDescriptions={[]}/>,

        trends: (gamer, chartState) => <GamerTrendChart gamer={gamer}
                                                        gameCategory={chartState.gameCategory}
                                                        baseUrl={chartState.baseUrl}
                                                        height={260}
                                                        width={chartState.width}
                                                        data={chartState.viewData}/>,

        recent_matches: (gamer, chartState) => <GamerMatchCardList gamer={gamer}
                                                                   noLink={true}
                                                                   gamerMatchList={chartState.viewData}/>
    }
};

//===---==--=-=--==---===----===---==--=-=--==---===----//

export default function GamerDetail({gamerData, view, gameCategory, baseUrl, error}) {

    const containerRef = React.useRef<HTMLDivElement>();
    if (error) {
        return <div>{error}</div>;
    }
    const {gamer, viewData, errorMessage, classDescriptions} = gamerData;

    const tabNames = Object.keys(CONFIG.VIEW_NAME_CONFIG).filter((key) => {
        const allowableUnoKeys = ['squads', 'trends', 'recent_matches'];
        if (gamer.platform == 'uno') {
            return allowableUnoKeys.includes(key);
        } else {
            return true;
        }
    });


    const tabOptions = tabNames.map((id) => {
        return {
            text: UtilityService.camelToProperCase(id),
            id: id
        };
    });

    const [chartState, setChartState] = useState({
        gameCategory: gameCategory,
        viewData: viewData,
        baseUrl: baseUrl,
        gamer: gamer,
        activeTab: view,
        width: 512
    });

    const overallWinRate = (TypeService.isNumeric(gamer.win_percentage)) ? gamer.win_percentage.toFixed(2) + '%' : '-';
    const gamesPlayed = (Number(gamer.total_kills) / Number(gamer.avg_kills)).toFixed(0);
    const [_componentDidUpdate, setComponentDidUpdate] = useState(false);


    useEffect(() => {
        setComponentDidUpdate(true);
        if (getChartWidth() !== chartState.width) {
            setChartState(Object.assign({}, chartState, {width: getChartWidth()}));
        }
    });

    const TabData = CONFIG.VIEW_NAME_CONFIG[chartState.activeTab](gamer, chartState);

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
        let damageDoneRatio = 0;

        if (gamer) {
            damageDoneRatio = UtilityService.round(Number(gamer.avg_damage_done) / Number(gamer.avg_damage_taken), 3);
        }
        let username = '';
        if (gamer) {
            username = gamer.username;
            if (gamer.platform == 'uno') {
                username = gamer.aliases[0] + '#' + gamer.username.substring(0, 6);
            }
        }

        return (
            <Page title={'Stats for ' + username}>
                <Navbar/>

                <Main>
                    <Container size={'lg'} mode={'sidebar'}>
                        <Sidebar>
                            <Header size={'lg'}>
                                {username}

                                <Small>
                                    <GamerPlatformImage gamer={gamer}/>
                                </Small>
                            </Header>

                            <GamerHeat gamer={gamer}/>

                            <GamerAliasList gamer={gamer}/>

                            <LabelValue label={'Classes'} value={<ClassBadgeList subject={gamer}
                                                                                 classDescriptions={classDescriptions.filter((description) => description['game_category'] === gameCategory)[0]}/>}/>

                            <LineBreak/>

                            <LabelValue style={{marginBottom: '15px'}} label={'KDR'} value={
                                <>
                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'All Games'}
                                                    statValue={gamer.kdr}/>

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 100 games'}
                                                    statValue={gamer.last_100_rolling_average_kdr}/>

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 30 games'}
                                                    statValue={gamer.last_30_rolling_average_kdr}
                                                    compareStatValue={gamer.last_100_rolling_average_kdr}
                                                    compareStatLabel={'compared to the last 100 games'}/>

                                    <StatLabelValue style={{marginBottom: '0px'}}
                                                    inline={true}
                                                    size={'sm'}
                                                    label={'Last 10 games'}
                                                    statValue={gamer.last_10_rolling_average_kdr}
                                                    compareStatValue={gamer.last_100_rolling_average_kdr}
                                                    compareStatLabel={'compared to the last 100 games'}/>
                                </>
                            }/>

                            <LabelValue label={'Average Kills / Deaths per game'}
                                        value={`${UtilityService.round(gamer.avg_kills, 2)} / ${UtilityService.round(gamer.avg_deaths, 2)}`}/>

                            <LabelValue label={'Damage Done/Taken Ratio'} value={damageDoneRatio}/>

                            <LabelValue label={'Max Kills'} value={gamer.max_kills}/>

                            <LabelValue label={'Overall Win Rate'} value={overallWinRate}/>

                            <LabelValue label={'Total Games'} value={gamesPlayed}/>

                            <LabelValue label={'Gulag Win Rate'} value={gamer.pretty_gulag_win_rate}/>

                            <LabelValue label={'Gulag KDR'} value={gamer.gulag_kdr}/>

                        </Sidebar>
                        <SidebarCompanion innerRef={containerRef}>
                            <TabNav options={tabOptions}
                                    value={chartState.activeTab}
                                    onChange={({id}) => setTabAndFetchData(id)}/>

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

    async function setTabAndFetchData(tabId) {
        const newState = {...chartState};
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
        return GamerService.getGamerDetailView(gamer.username as string, gamer.platform, tabId, gameCategory);
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, platform, view, game_category} = context.query;
    const validViewNames = Object.keys(CONFIG.VIEW_NAME_CONFIG);
    const queryCategory = game_category || GAME_CATEGORIES.WARZONE;
    let defaultView = 'teammates';

    if (platform == 'uno') {
        defaultView = 'recent_matches';
    }

    const selectedView = validViewNames.includes(view as string) ? context.query.view : defaultView;
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const rawGamerList = await GamerService.getGamerDetailView(username as string,
        platform as string,
        selectedView as string,
        queryCategory as string, baseUrl);

    const props = {
        gamerData: rawGamerList,
        gameCategory: queryCategory,
        view: selectedView,
        baseUrl: baseUrl
    };
    if (rawGamerList['message']) {
        props['error'] = rawGamerList['message'];
    }
    return {
        props
    };
};