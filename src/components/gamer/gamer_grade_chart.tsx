import {BarChart, Bar, XAxis, YAxis, Legend} from 'recharts';
import React, {useState} from "react";
import Radio from 'react-mdl/lib/Radio';
import RadioGroup from 'react-mdl/lib/RadioGroup';
import _ from 'lodash';
export default function GamerGradeChart({data, options, selectedValue}) {
    const [selectedChart, setActiveChart] = useState(selectedValue);
    let chartData = []
    Object.keys(data[0]).filter((key)=>key.includes(selectedChart)).forEach((key) => {
        chartData.push({value: data[0][key], name: key.charAt(0)})
    });
    let radioOptions =   options.map((option)=>{
            return <Radio checked={selectedChart === option} key={option} value={option} ripple
                   onClick={() => setActiveChart(option)}>{_.capitalize(option.split('_')[0])}</Radio>
        });
    return (
        <div style={{'margin': 'auto'}}>
            <BarChart  width={512} height={260} data={chartData}>
                <Bar dataKey="value" fill="#8884d8"/>
                <XAxis dataKey="name"/>
                <YAxis type="number" domain={[0, 'dataMax + 100']}/>
            </BarChart>
            <RadioGroup name="demo" value="opt1">
                {radioOptions}
            </RadioGroup>
        </div>
    )
}