import _ from 'lodash';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import React, {useState} from 'react';

import {InputRadio, Show, Header, Paragraph, Box} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerCardChartProps = {
    data: Object,
    height: number,
    width: number,
};

export default function GamerGradeChart({data, height, width}: GamerCardChartProps) {
    let chartData = generateChartData(data);
    return (
        <Box style={{marginTop: 15}}>

            <Header style={{margin: '0', padding: 0}}>Placement Percentage</Header>

            <Paragraph style={{marginBottom: '50px', marginTop: 0}} type={'help'}>
                The percentage of each game type where you place.
            </Paragraph>

            <BarChart width={width} height={height} data={chartData}>

                <Bar dataKey="type_solo_percentage_pretty"
                     unit={'%'}
                     name={'Solo'}
                     label={{fill: 'white', fontSize: '.75em'}}
                     fill="#779977"/>

                <Bar dataKey="type_duo_percentage_pretty"
                     unit={'%'}
                     name={'Duo'}
                     label={{fill: 'white', fontSize: '.75em'}}
                     fill="#775577"/>

                <Bar dataKey="type_trio_percentage_pretty"
                     unit={'%'}
                     name={'Trio'}
                     label={{fill: 'white', fontSize: '.75em'}}
                     fill="#777799"/>

                <Bar dataKey="type_quad_percentage_pretty"
                     unit={'%'}
                     name={'Quad'}
                     label={{fill: 'white', fontSize: '.75em'}}
                     fill="#997777"/>

                <XAxis dataKey="name"/>

                <YAxis type={'number'}/>

                <Legend/>

                <Tooltip contentStyle={{backgroundColor: 'rgba(20, 20, 20, .85)', border: '#444'}}
                         cursor={false}
                         itemStyle={{fontWeight: 'bold', lineHeight: '110%', margin: 0}}
                         position={{y: 200}}/>

            </BarChart>

        </Box>
    );
}


function generateChartData(data) {
    const gameTypes = ['solo', 'duo', 'trio', 'quad'];
    const placements = ['a', 'b', 'c', 'd', 'f'];

    const gameTypeSummaryList = gameTypes.map((gameType) => {
        let gameTypeSummary = {
            type: gameType,
            totalGames: 0
        };

        placements.forEach((placement) => {
            const key = [placement, 'grade', gameType, 'placements'].join('_');
            const value = Number(data[key]) || 0;

            gameTypeSummary.totalGames = gameTypeSummary.totalGames + value;
            gameTypeSummary['count_' + placement] = value;
        });

        placements.forEach((placement) => {
            const countGamesOfPlacement = gameTypeSummary['count_' + placement];
            const percentageOfTotalGames = countGamesOfPlacement / gameTypeSummary.totalGames;

            gameTypeSummary['percentage_' + placement] = percentageOfTotalGames;
            gameTypeSummary['percentage_' + placement + '_pretty'] = Number(Math.floor(percentageOfTotalGames * 100 * 10) / 10);
        });

        return gameTypeSummary;
    });

    return placements.map((placement) => {
        const placementSummary = {
            name: placement.toUpperCase()
        };

        gameTypeSummaryList.forEach((gameTypeSummary) => {
            let typeKey = ['type', gameTypeSummary.type].join('_');

            placementSummary[typeKey + '_count'] = gameTypeSummary['count_' + placement];
            placementSummary[typeKey + '_percentage'] = gameTypeSummary['percentage_' + placement];
            placementSummary[typeKey + '_percentage_pretty'] = gameTypeSummary['percentage_' + placement + '_pretty'];
        });

        return placementSummary;
    });
}