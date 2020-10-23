import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Recommended = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <sup {...props} className={classNames} style={props.style} ref={props.innerRef}>*</sup>
    );
};

export default Recommended;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Recommended.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'recommended'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}