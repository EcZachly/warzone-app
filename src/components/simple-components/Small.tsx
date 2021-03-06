import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Small = (props) => {
    const classNames = getClassNames(props);

    return (
        <small title={props.title} {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </small>
    );
};

export default Small;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Small.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    title: PropTypes.string,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'small'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}