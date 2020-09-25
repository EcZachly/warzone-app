import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_TYPES: [
        'error',
        'help'
    ]
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Paragraph = (props) => {
    const classes = getClassNames(props);
    
    return (
        <p className={classes} style={props.style}>
            {props.children}
        </p>
    );
};

export default Paragraph;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Paragraph.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //text align to the center
    textCenter: PropTypes.bool,
    
    //text align to the left
    textLeft: PropTypes.bool,
    
    //text align to the right
    textRight: PropTypes.bool,
    
    //A simple additional styling option to quickly format the text as a certain type
    type: PropTypes.oneOf(CONSTANTS.VALID_TYPES)
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'paragraph'
    ];
    
    classNames.push(getType(props));
    
    if (props.textCenter === true) {
        classNames.push('text-center');
    }
    
    if (props.textLeft === true) {
        classNames.push('text-left');
    }
    
    if (props.textRight === true) {
        classNames.push('text-right');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function getType(props) {
    const propType = props.type;
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return ((validTypes.includes(propType)) ? ('text-' + propType) : '');
}
