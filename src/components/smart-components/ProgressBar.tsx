import React from 'react';

import {Progress, ProgressBar} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const ProgressBarContainer = (props) => {
    return (
        <Progress height={props.height} className={props.className} style={props.style}>
            <ProgressBar value={props.value}
                         color={props.color}
                         type={props.type}
                         animated={props.animated}
                         striped={props.striped}
                         showLabel={props.showLabel}/>
        </Progress>
    );
};
export default ProgressBarContainer;