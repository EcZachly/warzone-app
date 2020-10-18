import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const ListItem = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <li className={classNames} style={props.style} data-has-on-click={!!props.onClick}>
            {props.children}
        </li>
    );
};

export default ListItem;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ListItem.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}