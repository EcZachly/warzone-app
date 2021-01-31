import React, {useState} from 'react';
import _ from 'lodash';

import {Box, Paragraph} from '../SimpleComponents';
import {Input} from './../SmartComponents';

import TrendChart from '../charting/TrendChart';
import {GamerService} from './index';


export default function GamerTrendChart({gamer, gameCategory, baseUrl, data, height, width}) {
    const [chosenChart, setChosenChart] = useState('kdr');
    const rollingViews = ['last_10_rolling_average', 'last_30_rolling_average', 'last_100_rolling_average'];

    const trends = {
        'kdr': rollingViews.map((view) => `${view}_kdr`),
        'kills': rollingViews.map((view) => `${view}_kills`),
        'deaths': rollingViews.map((view) => `${view}_deaths`),
    };

    const radioOptions = getRadioOptions(Object.keys(trends));

    const viewData = data.map((row) => {
        trends[chosenChart].forEach((col) => {
            row[GamerService.sanitizeStatKey(col)] = row[col];
        });

        return row;
    });


    if (viewData.length) {
        const capitalKeys = trends[chosenChart].map((key) => GamerService.sanitizeStatKey(key));

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
            text: GamerService.sanitizeStatKey(option),
            className: ''
        };
    });
}
