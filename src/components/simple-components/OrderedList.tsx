import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const OrderedList = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <ol className={classNames} style={props.style}>
            {props.children}
        </ol>
    );
};

export default OrderedList;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

OrderedList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'list',
        'ordered-list'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.type === 'help') {
        classNames.push('help');
    }
    
    return classNames.join(' ');
}