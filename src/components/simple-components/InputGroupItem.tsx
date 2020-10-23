import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_TYPES: [
        'prepend',
        'append'
    ]
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const InputGroupItem = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default InputGroupItem;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

InputGroupItem.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,

    type: PropTypes.oneOf(CONSTANTS.VALID_TYPES)
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    classNames.push(getType(props));
    
    return classNames.join(' ');
}


function getType(props) {
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return 'input-group-' + ((props.type && validTypes.includes(props.type)) ? props.type : validTypes[0]);
}