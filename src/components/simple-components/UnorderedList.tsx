import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const UnorderedList = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <ul className={classNames} style={props.style}>
            {props.children}
        </ul>
    );
};

export default UnorderedList;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

UnorderedList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'list',
        'unordered-list'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.type === 'help') {
        classNames.push('help');
    }
    
    return classNames.join(' ');
}