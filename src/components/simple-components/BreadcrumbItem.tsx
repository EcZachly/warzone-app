import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbItem = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <Link className={classNames} style={props.style} href={props.href}>
            {props.children}
        </Link>
    );
};
export default BreadcrumbItem;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

BreadcrumbItem.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //If the current item is active, this will gray it out and prevent the user from clicking on it
    active: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'breadcrumb-item'
    ];
    
    if (props.active === true) {
        classNames.push('active');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}