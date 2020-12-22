import React, {useState} from 'react';
import _ from 'lodash';

import {Box, Paragraph} from '../SimpleComponents';
import {Input} from './../SmartComponents';

import TrendChart from '../charting/TrendChart';


export default function GamerTrendChart({gamer, gameCategory, baseUrl, data, height, width}) {
    let [chosenChart, setChosenChart] = useState('kdr');
    let rollingViews = ['last_10_rolling_average', 'last_30_rolling_average', 'last_100_rolling_average'];

    let trends = {
        'kdr': rollingViews.map((view) => `${view}_kdr`),
        'kills': rollingViews.map((view) => `${view}_kills`),
        'deaths': rollingViews.map((view) => `${view}_deaths`),
    };

    const radioOptions = getRadioOptions(Object.keys(trends));

    let viewData = data.map((row) => {
        trends[chosenChart].forEach((col) => {
            row[col.split('_').map(_.capitalize).join(' ')] = row[col];
        });

        return row;
    });


    if (viewData.length) {
        let capitalKeys = trends[chosenChart].map((key) => key.split('_').map(_.capitalize).join(' '));

        return (
            <Box>
                <TrendChart gamer={gamer}
                            category={gameCategory}
                            baseUrl={baseUrl}
                            data={viewData}
                            height={height}
                            width={width}
                            keysToChart={capitalKeys}/>

                <Box style={{clear: 'both', marginTop: '20px'}}>
                    <Input type={'radio'}
                           options={radioOptions}
                           value={chosenChart}
                           onChange={setChosenChart}/>
                </Box>

            </Box>
        );
    } else {
        return (
            <Paragraph>
                No data found for this time frame
            </Paragraph>
        );
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
