import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const TableRow = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <tr {...props}
            className={classNames}
            style={props.style}
            ref={props.innerRef}
            onClick={(event) => {
                if (props.onClick) {
                    props.onClick(props, event);
                }
            }}>
            {props.children}
        </tr>
    );
};
export default TableRow;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

TableRow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    onClick: PropTypes.func,
    align: PropTypes.oneOf(['middle'])
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = ['tr'];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.align) {
        if (props.align === 'middle') {
            classNames.push('align-middle');
        }
    }
    
    if (props.onClick) {
        classNames.push('row-clickable');
    }
    
    return classNames.join(' ');
}