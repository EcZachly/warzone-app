import React, {useState} from "react";
import TrendChart from "../charting/TrendChart";
import {Box, InputRadio} from "../SimpleComponents";
import _ from 'lodash';

export default function GamerTrendChart({gamer, gameCategory, baseUrl, data, height, width}) {
    let [chosenChart, setChosenChart] = useState("kills")
    let rollingViews = ['last_10_rolling_average', 'last_30_rolling_average', 'last_100_rolling_average']



    let trends = {
        'kills': rollingViews.map((view) => view + '_' + 'kills'),
        'deaths': rollingViews.map((view) => view + '_' + 'deaths'),
        'kdr': rollingViews.map((view) => view + '_' + 'kdr'),
    }
    const radioOptions = getRadioOptions(Object.keys(trends));

    let viewData = data.map((row)=>{
        trends[chosenChart].forEach((col)=>{
            row[col.split('_').map(_.capitalize).join(' ')] = row[col]
        });
        return row;
    })


    if(viewData.length){
        let capitalKeys = trends[chosenChart].map((key)=> key.split('_').map(_.capitalize).join(' '))
        return <div>
            <TrendChart gamer={gamer} category={gameCategory} baseUrl={baseUrl} data={viewData} height={height} width={width} keysToChart={capitalKeys}/>
            <div style={{clear: 'both'}}>
                <InputRadio name="demo" value={chosenChart} options={radioOptions}
                            onChange={(val) => setChosenChart(val)}/>
            </div>

        </div>
    }
    else{
        return <p>No data found for this time frame</p>
    }

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
