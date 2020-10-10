import React from 'react';

import Header from './Header';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const CardHeader = (props:CardHeaderProps) => {
    const classNames = getClassNames(props);

    return (
        <Header {...props} className={classNames} size={props.size || 'sm'}>
            {props.children}
        </Header>
    );
};
export default CardHeader;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CardHeaderProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    size?: string
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