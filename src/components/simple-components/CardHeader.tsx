import React from 'react';

import Box from './Box';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const CardHeader = (props:CardHeaderProps) => {
    const classNames = getClassNames(props);

    return (
        <Box {...props} className={classNames}>
            {props.children}
        </Box>
    );
};
export default CardHeader;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CardHeaderProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS


function getClassNames(props) {
    const classNames = [
        'card-header'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}