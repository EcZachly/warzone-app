import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_BUTTON_TYPES: [
        'button',
        'submit'
    ],
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
        'default': 'light',
        'dark': 'dark',
        'link': 'link'
    },
    VALID_SIZES: [
        'xs',
        'sm',
        'lg'
    ]
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Button = (props) => {
    const classNames = getClassNames(props);
    const buttonType = getButtonType(props);
    
    return (
        <button className={classNames}
                type={buttonType}
                style={props.style}
                disabled={props.disabled}
                data-has-on-click={!!props.onClick}
                onClick={(event) => {
                    if (props.onClick) {
                        props.onClick(props, event);
                    }
                }}>
            {props.children}
        </button>
    );
};
export default Button;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Button.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The HTML button "type"
    buttonType: PropTypes.oneOf(CONSTANTS.VALID_BUTTON_TYPES),
    
    //If you don't want to have a default color scheme for the button
    noDefaultType: PropTypes.bool,
    
    //Make the button stretch to the full width of it's container
    block: PropTypes.bool,
    
    //Switch to the outlined version of the button
    outline: PropTypes.bool,
    
    size: PropTypes.string,
    
    //The color scheme of the button
    type: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_TYPES)),
    
    //Clicking on the button
    onClick: PropTypes.func
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getButtonType(props) {
    const validButtonTypes = CONSTANTS.VALID_BUTTON_TYPES;
    
    return validButtonTypes.includes(props.buttonType) ? props.buttonType : validButtonTypes[0];
}


function getClassNames(props) {
    let classNames = [
        'button'
    ];
    
    if (props.noDefaultType !== true) {
        classNames.push(getType(props));
    }
    
    if (props.block === true) {
        classNames.push('block');
    }
    
    if (props.outline === true) {
        classNames.push('outline');
    }
    
    if (props.size) {
        classNames.push(getSize(props));
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function getSize(props) {
    const validSizes  = CONSTANTS.VALID_SIZES;
    
    if (validSizes.includes(props.size)) {
        return 'button-' + props.size;
    }
}


function getType(props) {
    const defaultType = 'default';
    const propType = props.type;
    
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return 'button-' + ((validTypes[propType]) ? validTypes[propType] : validTypes[defaultType]);
}