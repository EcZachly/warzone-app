import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Row = (props) => {
    const classNames = getClassNames(props);

    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Row;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Row.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'row'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}