import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const InlineSeparator = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};

export default InlineSeparator;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

InlineSeparator.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'inline-separator'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}