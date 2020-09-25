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


const ProgressBar = (props) => {
    const classNames = getClassNames(props);
    const style = getStyle(props);
    const label = getLabel(props);
    
    return (
        <div className={classNames}
             style={style}
             role={'progressbar'}
             aria-valuenow={props.value}
             aria-valuemin={0}
             aria-valuemax={100}>
            {label}
        </div>
    );
};
export default ProgressBar;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ProgressBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //Make the progress bar striped
    striped: PropTypes.bool,
    
    //If the progress bar is striped, this will animate it
    animated: PropTypes.bool,
    
    type: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_TYPES)),
    
    value: function(props, propName, componentName) {
        const value = props[propName];
        const isUndefined = (TypeService.isUndefined(value) || TypeService.isNull(value));
        
        if (isUndefined === false) {
            if (TypeService.isInteger(props[propName]) === false || props[propName] > 100 || props[propName] < 0) {
                return new Error(`Invalid prop ${propName} supplied to ${componentName}. It must be an Integer between 0 and 100`);
            }
        }
    }
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'progress-bar'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.striped === true) {
        classNames.push('progress-bar-striped');
        
        if (props.animated === true) {
            classNames.push('progress-bar-animated');
        }
    }
    
    classNames.push(getType(props));
    
    return classNames.join(' ');
}


function getType(props) {
    const defaultType = 'primary';
    const propType = props.type || props.color;
    
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return 'bg-' + ((validTypes[propType]) ? validTypes[propType] : validTypes[defaultType]);
}


function getStyle(props) {
    let style = {};
    
    if (TypeService.isObject(props.style)) {
        style = {...style, ...props.style};
    }
    
    style.width = getCurrentValuePosition(props) + '%';
    
    return style;
}


function getCurrentValuePosition(props) {
    const currentValue = sanitizeValue(props.value);
    
    if (currentValue > 100) {
        return 100;
    } else if (currentValue < 0) {
        return 0;
    } else {
        return currentValue;
    }
}


function sanitizeValue(value) {
    return Math.round(value);
}


function getLabel(props) {
    if (props.showLabel === true) {
        return getCurrentValuePosition(props) + '%';
    } else {
        return '';
    }
}