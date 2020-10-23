import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbSeparator = (props:BreadcrumbSeparatorProps) => {
    const classNames = getClassNames(props);
    const separator = getSeparator(props);
    
    return (
        <span {...props} className={classNames} style={props.style} ref={props.innerRef}>
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
    innerRef?: any,
    separator?: string
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
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