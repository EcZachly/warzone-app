import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbContainer = (props:BreadcrumbContainerProps) => {
    const classNames = getClassNames(props);
    
    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default BreadcrumbContainer;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type BreadcrumbContainerProps = {
    className?: string,
    innerRef?: any,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    withBackground?: boolean
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'breadcrumb-container'
    ];
    
    if (props.withBackground === true) {
        classNames.push('breadcrumb-background');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}