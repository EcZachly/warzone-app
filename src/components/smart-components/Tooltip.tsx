import React, {useState} from 'react';

import {Box} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



type TooltipProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    showFunction: (tooltipProps) => unknown,
}


export default function Tooltip(props: TooltipProps) {
    const [show, updateShow] = useState(false);

    return (
        <Box className={'tooltip-container'}
             style={{...props.style}}
             onMouseEnter={() => updateShow(true)}
             onMouseLeave={() => updateShow(false)}>
            {(show === true) ? props.showFunction({
                style: {
                    pointerEvents: 'none'
                }
            }) : null}
            {props.children}
        </Box>
    );
}