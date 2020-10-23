import React from 'react';

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

const Button = (props: ButtonProps) => {
    const classNames = getClassNames(props);
    const buttonType = getButtonType(props);

    return (
        <button {...props}
                className={classNames}
                type={buttonType}
                style={props.style}
                disabled={props.disabled}
                data-has-on-click={!!props.onClick}
                ref={props.innerRef}
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

const TS_VALID_TYPES = [...Object.keys(CONSTANTS.VALID_TYPES)] as const;

type ButtonProps = {
    onClick?:  (ButtonProps, any) => void,
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    buttonType?: (typeof CONSTANTS.VALID_BUTTON_TYPES) | string,
    noDefaultType?: boolean,
    block?: boolean,
    outline?: boolean,
    size?: typeof CONSTANTS.VALID_SIZES,
    type?: typeof TS_VALID_TYPES | string,
    disabled?: boolean
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getButtonType(props) {
    const validButtonTypes = CONSTANTS.VALID_BUTTON_TYPES;

    return validButtonTypes.includes(props.buttonType) ? props.buttonType : validButtonTypes[0];
}


function getClassNames(props) {
    const classNames = [
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
    const validSizes = CONSTANTS.VALID_SIZES;

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