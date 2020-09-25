import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_TYPES: {
        'primary': 'primary',
        'blue': 'primary',
        'secondary': 'secondary',
        'success': 'success',
        'green': 'success',
        'danger': 'danger',
        'red': 'danger',
        'error': 'danger',
        'warning': 'warning',
        'yellow': 'warning',
        'orange': 'orange',
        'purple': 'purple',
        'pink': 'pink',
        'light': 'light',
        'dark': 'dark'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Badge = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Badge;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Badge.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //Renders the badge with a pill style
    pill: PropTypes.bool,
    
    //The color scheme of the alert
    type: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_TYPES))
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS


function getClassNames(props) {
    let classNames = [
        'badge'
    ];
    
    classNames.push(getType(props));
    
    if (props.pill === true) {
        classNames.push('badge-pill');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}

function getType(props) {
    const defaultType = 'light';
    const propType = props.type || props.color;
    
    
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return 'badge-' + ((validTypes[propType]) ? validTypes[propType] : validTypes[defaultType]);
}