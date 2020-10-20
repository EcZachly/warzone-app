import React, {useState} from 'react';

import {Paragraph, Label, Link, Show, Text, Box} from './../SimpleComponents';

import Placeholder from './Placeholder';

const CONSTANTS = {};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const Tooltip = (props) => {
    const [show, updateShow] = useState(false);

    return (
        <Box className={'tooltip-container'}
             style={props.style}
             onMouseEnter={() => updateShow(true)}
             onMouseLeave={() => updateShow(false)}>
            {(show === true) ? generateTooltip(props) : null}
            {props.children}
        </Box>
    );
};
export default Tooltip;


function generateTooltip(props) {
    return (
        <div className={'tooltip'}>
            {props.value}
        </div>
    )
}