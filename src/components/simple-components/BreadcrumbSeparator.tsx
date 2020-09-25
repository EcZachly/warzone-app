import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbSeparator = (props) => {
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

BreadcrumbSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The string used to separate two breadcrumb items
    separator: PropTypes.string
};


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