import React, {useState} from 'react';
import {Box} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const Tooltip = (props) => {
    const [show, updateShow] = useState(false);

    return (
        <Box className={'tooltip-container'}
             style={props.style}
             onMouseEnter={() => updateShow(true)}
             onMouseLeave={() => updateShow(false)}>
            {(show === true) ? props.showFunction() : null}
            {props.children}
        </Box>
    );
};
export default Tooltip;