import React from 'react';

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

export function Alert(props: AlertProps) {
    const classNames = getClassNames(props);
    
    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

const VALID_TYPE_ENTRIES = [...Object.keys(CONSTANTS.VALID_TYPES)] as const;
const DEFAULT_TYPE = 'primary';

type AlertProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    hideIfEmpty?: boolean,
    type?: (typeof VALID_TYPE_ENTRIES)[number]
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'alert'
    ];
    
    classNames.push(getType(props));
    
    if (props.hideIfEmpty && !props.children) {
        classNames.push('display-none');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}



function getType(props) {
    const defaultType = 'primary';
    const propType = props.type;
    
    const validTypes = CONSTANTS.VALID_TYPES;
    
    return 'alert-' + ((validTypes[propType]) ? validTypes[propType] : validTypes[defaultType]);
}

export default Alert;
