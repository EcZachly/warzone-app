

import _ from 'lodash';
import {LineChart, Line, Legend, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import React, {useState} from 'react';

import {InputRadio, Box} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//



function dateToYMD(date) {
    const strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = date.getDate();
    const m = strArray[date.getMonth()];
    return '' + (d <= 9 ? '0' + d : d) + '-' + m
}

export default function TrendChart({data, keysToChart, height, width, timestampColumn="start_timestamp"}) {
    let colors = ['#8884d8','#FFEE00', '#DD00FF']

    let viewData = data.map((d)=> {
        d.timestamp = dateToYMD(new Date(d[timestampColumn]));
        return d;
    })

    let lines = Object.keys(viewData[0]).filter((key)=> keysToChart.includes(key)).map((key, index)=>{
       return <Line type="monotone" dot={false} dataKey={key} stroke={colors[index]} />
    })

    return (
        <Box style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>

            <LineChart width={width} height={height} data={data}>
                <Tooltip coordinate={{x:0, y:200}} allowEscapeViewBox={{x: false, y:true}}
                         formatter={(value, name, props) => {
                            return parseFloat(value).toFixed(2)
                         }}
                         labelFormatter={(label)=> label.split('_').map(_.capitalize).join(' ')}
                />
                <Legend />
                <XAxis minTickGap={5} tickCount={30} dataKey="timestamp"/>
                <YAxis type="number"/>
                {lines}
            </LineChart>
        </Box>
    );
}
