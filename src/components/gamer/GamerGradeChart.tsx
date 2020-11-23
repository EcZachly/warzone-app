import _ from 'lodash';
import {BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import React, {useState} from 'react';

import {InputRadio, Show, Box} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//

type GamerCardChartProps = {
    data?: Object[],
    rawData?: Object[],
    options?: string[],
    selectedValue: string,
    height: number,
    width: number,
};

export default function GamerGradeChart({data, rawData, options, selectedValue, height, width}: GamerCardChartProps) {
    const [selectedChart, setActiveChart] = useState(selectedValue);
    let chartData = rawData;

    if (!rawData) {
        chartData = generateChartData(data, selectedChart);
    }

    const radioOptions = getRadioOptions(options);



    return (
        <Box style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <BarChart width={width} height={height} data={chartData}>

                <Bar dataKey="# of Games" label={{fill: 'white'}} fill="#778877"/>

                <XAxis dataKey="name"/>

                <YAxis type="number"/>

                <Tooltip position={{y: 300}}/>

            </BarChart>

            <Show show={options.length > 0}>
                <InputRadio name="demo" value={selectedChart} options={radioOptions}
                            onChange={(val) => setActiveChart(val)}/>
            </Show>

        </Box>
    );
}



function getRadioOptions(options) {
    return options.map((option) => {
        return {
            value: option,
            text: option.split('_').map(_.capitalize).join(' '),
            className: ''
        };
    });
}



function generateChartData(data, selectedChart) {
    const chartData = [];

    Object.keys(data[0]).filter((key) => key.includes(selectedChart)).forEach((key) => {
        chartData.push({
            '# of Games': parseFloat(data[0][key]),
            name: key.charAt(0).toUpperCase()
        });
    });

    return chartData;
}