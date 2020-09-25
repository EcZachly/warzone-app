import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Column = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Column;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Column.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'column',
        'col'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    classNames.push(getSize(props));
    
    return classNames.join(' ');
}



function getSize(props) {
    const validSizes = ['xs', 'sm', 'md', 'lg'];
    
    return validSizes.filter((size) => {
        return !!props[size] || isNaN(props[size]) === false;
    }).map((size) => {
        return `col-${size}-${props[size]}`;
    }).join(' ');
}