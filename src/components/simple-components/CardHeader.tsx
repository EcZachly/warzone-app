import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';

import Header from './Header';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const CardHeader = (props) => {
    const classNames = getClassNames(props);
    const size = getSize(props);
    
    return (
        <Header {...props} className={classNames} size={size}>
            {props.children}
        </Header>
    );
};
export default CardHeader;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

CardHeader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    size: Header.propTypes.size
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getSize(props) {
    return (TypeService.isString(props.size) && props.size.length > 0) ? props.size : 'sm';
}


function getClassNames(props) {
    let classNames = [
        'card-header'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}