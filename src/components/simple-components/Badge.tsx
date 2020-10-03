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

const Badge = (props:BadgeProps) => {
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

const VALID_TYPE_ENTRIES = [...Object.keys(CONSTANTS.VALID_TYPES)] as const;

type BadgeProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    pill?: boolean,
    type?: (typeof VALID_TYPE_ENTRIES)[number]
}


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