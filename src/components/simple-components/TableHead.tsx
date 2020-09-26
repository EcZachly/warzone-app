import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const TableHead = (props) => {
    const classNames = getClassNames(props);

    return (
        <thead className={classNames} style={props.style}>
            {props.children}
        </thead>
    );
};

export default TableHead;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

TableHead.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'table-head'
    ];
    
    if (props.alignLeft) {
        classNames.push('align-left');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}