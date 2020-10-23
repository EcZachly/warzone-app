import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Required = (props) => {
    const classNames = getClassNames(props);

    return (
        <sup {...props} className={classNames} style={props.style} ref={props.innerRef}>*</sup>
    );
};

export default Required;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Required.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'required'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}