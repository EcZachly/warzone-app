import {Bar, BarChart, Tooltip, XAxis, YAxis} from 'recharts';
import React, {useState} from 'react';
import _ from 'lodash';

import {Box, Header, InputRadio, Small} from '../SimpleComponents';
import {GamerService} from './index';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export default function GamerTimeChart({viewData, options, selectedValue, height, width}) {
    const [selectedChart, setActiveChart] = useState(selectedValue);
    const [selectedSeries, setActiveSeries] = useState('kdr');

    const chartData = viewData.filter((row) => row.analysis_type === selectedChart);

    if (chartData.length > 0) {
        const analysisTypeInputOptions = options.map((option) => {
            return {
                value: option,
                text: GamerService.sanitizeStatKey(option),
                className: ''
            };
        });

        const seriesTypeInputOptions = Object.keys(chartData[0]).filter((i, index) => index > 5).map((option) => {
            return {
                value: option,
                text: GamerService.sanitizeStatKey(option),
                className: ''
            };
        });

        return (
            <Box style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

                <Small className={'aliases'}>
                    {'All times are in ' + Intl.DateTimeFormat().resolvedOptions().timeZone + '  timezone'}
                </Small>

                <InputRadio name="demo" value={selectedChart} options={analysisTypeInputOptions}
                            onChange={(val) => setActiveChart(val)}/>

                <BarChart width={width} height={height} data={chartData}>

                    <Bar dataKey={selectedSeries} fill="#8884d8"/>

                    <XAxis dataKey="time_grain"/>

                    <YAxis type="number"/>

                    <Tooltip position={{y: 300}}/>

                </BarChart>

                <InputRadio name="series" value={selectedSeries} options={seriesTypeInputOptions}
                            onChange={(val) => setActiveSeries(val)}/>
            </Box>
        );

    } else {
        return (
            <Box style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
                <Header size={'sm'}>No Data found</Header>
            </Box>
        );
    }

}