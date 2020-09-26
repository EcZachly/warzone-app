import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Table = (props) => {
    const classNames = getClassNames(props);

    return (
        <table className={classNames} style={props.style}>
            {props.children}
        </table>
    );
};

export default Table;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Table.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,

    striped: PropTypes.bool,
    
    hover: PropTypes.bool,
    
    bordered: PropTypes.bool,
    
    small: PropTypes.bool,
    
    responsive: PropTypes.bool,
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'table'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }

    if (props.striped === true) {
        classNames.push('table-striped');
    }

    if (props.hover === true) {
        classNames.push('table-hover');
    }

    if (props.bordered === true) {
        classNames.push('table-bordered');
    }

    if (props.small === true) {
        classNames.push('table-sm');
    }

    if (props.responsive === true) {
        classNames.push('table-responsive');
    }

    if (props['responsive-sm'] === true) {
        classNames.push('table-responsive-sm');
    }

    if (props['responsive-md'] === true) {
        classNames.push('table-responsive-md');
    }

    if (props['responsive-lg'] === true) {
        classNames.push('table-responsive-lg');
    }

    if (props['responsive-xl'] === true) {
        classNames.push('table-responsive-xl');
    }

    return classNames.join(' ');
}