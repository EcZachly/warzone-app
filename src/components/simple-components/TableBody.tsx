import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const TableBody = (props) => {
    const classNames = getClassNames(props);

    return (
        <tbody {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </tbody>
    );
};
export default TableBody;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

TableBody.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'table-body'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}