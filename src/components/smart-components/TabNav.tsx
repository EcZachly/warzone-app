import React from 'react';

import {Box, Button} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

type TabNavProps = {
    className?: string,
    style?: React.CSSProperties,
    options: Option[],
    onChange: (Option) => void,
    value: string,
    activeColor?: string,
    inactiveColor?: string
};


type Option = {
    text: string,
    id: string,
    style?: React.CSSProperties,
    [x: string]: any
}

export default function TabNav(props: TabNavProps) {
    const activeColor = props.activeColor || 'dark';
    const inactiveColor = props.inactiveColor || 'link';

    return (
        <Box className={'tab-nav ' + props.className} style={props.style}>
            {
                props.options.map((option) => {
                    const {text, id} = option;
                    const isActive = (props.value === id);

                    return (
                        <Button type={isActive ? activeColor : inactiveColor}
                                className={'tab ' + (isActive ? 'active' : 'inactive') + '-tab'}
                                style={option.style}
                                onClick={() => isActive === false && props.onChange(option)}>
                            {text}
                        </Button>
                    );
                })
            }
        </Box>
    );
}