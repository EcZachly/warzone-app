import {BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import React, {useState} from "react";
import {InputRadio} from '../SimpleComponents';
import _ from 'lodash';
export default function GamerTimeChart({viewData, options, selectedValue, height, width}) {
    const [selectedChart, setActiveChart] = useState(selectedValue);
    const [selectedSeries, setActiveSeries] = useState("kdr");
    let chartData = viewData.filter((row)=> row.analysis_type === selectedChart);
    if(chartData.length > 0){
        let analysisTypeInputOptions = options.map((option)=>{
            return {
                value: option,
                text: option.split('_').map(_.capitalize).join(' '),
                className: ''
            }
        })

        let seriesTypeInputOptions = Object.keys(chartData[0]).filter((i, index)=> index > 5).map((option)=>{
            return {
                value: option,
                text: option.split('_').map(_.capitalize).join(' '),
                className: ''
            }
        })
        return (
            <div style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
                <small className={"aliases"}>{"All times are in " +  Intl.DateTimeFormat().resolvedOptions().timeZone + "  timezone"}</small>
                <InputRadio name="demo" value={selectedChart} options={analysisTypeInputOptions} onChange={(val)=> setActiveChart(val)}/>
                <BarChart  width={width} height={height} data={chartData}>
                    <Bar dataKey={selectedSeries} fill="#8884d8"/>
                    <XAxis dataKey="time_grain"/>
                    <YAxis type="number"/>
                    <Tooltip position={{ y: 300 }}/>
                </BarChart>
                <InputRadio name="series" value={selectedSeries} options={seriesTypeInputOptions} onChange={(val)=> setActiveSeries(val)}/>
            </div>
        )

    }
    else{
        return  <div style={{'marginLeft': 'auto', 'marginRight': 'auto', 'marginBottom': '10px'}}>
            <h3>No Data found</h3>
        </div>;
    }

}