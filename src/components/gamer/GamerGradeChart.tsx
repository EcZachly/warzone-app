import {BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import React, {useState} from "react";
import {InputRadio} from '../SimpleComponents';
import _ from 'lodash';

function renderTooltip(props){
    console.log(props);
    return (
        <div>{"Number of games:" + JSON.stringify(props)}</div>
    )
}

export default function GamerGradeChart({data, options, selectedValue, height, width}) {
    const [selectedChart, setActiveChart] = useState(selectedValue);
    let chartData = []
    Object.keys(data[0]).filter((key)=>key.includes(selectedChart)).forEach((key) => {
        chartData.push({"# of Games": parseFloat(data[0][key]), name: key.charAt(0).toUpperCase()})
    });
    let radioOptions = options.map((option)=>{
        return {
            value: option,
            text: option.split('_').map(_.capitalize).join(' '),
            className: ''
        }
    })
    return (
        <div style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
            <BarChart  width={width} height={height} data={chartData}>
                <Bar dataKey="# of Games" fill="#8884d8"/>
                <XAxis dataKey="name"/>
                <YAxis type="number"/>
                <Tooltip position={{ y: 300 }}/>
            </BarChart>
            <InputRadio name="demo" value={selectedChart} options={radioOptions} onChange={(val)=> setActiveChart(val)}/>
        </div>
    )
}