import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbSeparator = (props:BreadcrumbSeparatorProps) => {
    const classNames = getClassNames(props);
    const separator = getSeparator(props);
    
    return (
        <span className={classNames} style={props.style}>
            {separator}
        </span>
    );
};
export default BreadcrumbSeparator;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS


type BreadcrumbSeparatorProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    separator?: string
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'breadcrumb-separator'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function getSeparator(props) {
    const defaultValue = '/';
    return (typeof props.separator === 'string') ? props.separator : defaultValue;
}