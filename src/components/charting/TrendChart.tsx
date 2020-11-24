import _ from 'lodash';
import {LineChart, Line, Legend, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import React, {useState} from 'react';

import {InputRadio, Box, Button} from '../SimpleComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//


function dateToYMD(date) {
    const strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = date.getDate();
    const m = strArray[date.getMonth()];
    return '' + (d <= 9 ? '0' + d : d) + '-' + m
}


function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}


export default function TrendChart({gamer, data, baseUrl, keysToChart, height, width, timestampColumn = "start_timestamp"}) {
    let colors = ['#8884d8', '#FFEE00', '#DD00FF']
    let [trendValue, setTrendValue] = useState(30);
    let [maxTrendWindow, setMaxTrendWindow] = useState(30);
    let [chartData, setChartData] = useState(data);
    let [filteredData, setFilteredData] = useState(data);


    const fetchViewData = async (windowSize) => {
        const dataUrl = baseUrl + '/api/gamer/' + gamer.platform + '/' + encodeURIComponent(gamer.username as string) + '?view=trends&lookback=' + windowSize
        const response = await fetch(dataUrl);
        return await response.json();
    };
    let today = new Date();
    const setTrendWindowAndFetchData = async (windowSize) => {
        if(maxTrendWindow < windowSize){
            const fetchedData = await fetchViewData(windowSize);

            let filtered = fetchedData.viewData.filter((row)=>{
                let diff = datediff(new Date(row[timestampColumn]), today);
                return diff < windowSize;
            })
            setFilteredData(filtered)
            setMaxTrendWindow(windowSize)
            setChartData(fetchedData.viewData)
        }
        else{
            let filtered = _.clone(chartData).filter((row)=>{
                let diff = datediff(new Date(row[timestampColumn]), today);
                return diff < windowSize;
            })
            console.log(filtered)
            setFilteredData(filtered)

        }

        setTrendValue(windowSize);
    };

    let trendWindows = [
        {
            size: 3,
            name: '3 d'
        },
        {
            size: 7,
            name: '1 wk'
        },
        {
            size: 14,
            name: '2 wk'
        },
        {
            size: 30,
            name: '1 mnth'
        },
        {
            size: 365,
            name: '1 yr'
        },
        {
            size: 50000,
            name: 'max'
        }
    ];


    let buttonList = trendWindows.map((trendWindow) => {
        return <Button key={'trend' + trendWindow.size} type={trendValue == trendWindow.size ? 'purple' : 'light'}
                       onClick={() => trendValue == trendWindow.size ? '' : setTrendWindowAndFetchData(trendWindow.size)}>
            {trendWindow.name}
        </Button>
    });

    let viewData = filteredData.map((d) => {
        d.timestamp = dateToYMD(new Date(d[timestampColumn]));
        keysToChart.forEach((key) => {
            d[key] = d[key.split(' ').map((k) => k.toLowerCase()).join('_')]
        })
        return d;
    })



    let lines = Object.keys(viewData[0]).filter((key) => keysToChart.includes(key)).map((key, index) => {
        return <Line type="monotone" dot={false} dataKey={key} stroke={colors[index]}/>
    })

    return (
        <Box>
            <div style={{width: '80%', float: 'left'}}>
            <LineChart  width={width} height={height} data={filteredData}>
                <Tooltip coordinate={{x: 0, y: 200}} allowEscapeViewBox={{x: false, y: true}}
                         formatter={(value, name, props) => {
                             return parseFloat(value).toFixed(2)
                         }}
                         labelFormatter={(label) => label.split('_').map(_.capitalize).join(' ')}
                />
                <Legend/>
                <XAxis minTickGap={5} tickCount={30} dataKey="timestamp"/>
                <YAxis type="number"/>
                {lines}
            </LineChart>
            </div>
            <div>
                <div style={{float: 'left'}}>
                    {buttonList}
                </div>
            </div>
        </Box>
    );
}
