import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_TYPES: [
        'error',
        'help'
    ]
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Paragraph = (props: ParagraphProps) => {
    const classes = getClassNames(props);
    
    return (
        <p {...props} className={classes} style={props.style} ref={props.innerRef} onClick={() => {
            if (props.onClick){
                props.onClick(props, {});
            }
        }}>
            {props.children}
        </p>
    );
};

export default Paragraph;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type ParagraphProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    //text align to the center
    textCenter?: boolean,
    
    //text align to the left
    textLeft?: boolean,
    innerRef?: any,
    
    //text align to the right
    textRight?: boolean,
    
    //A simple additional styling option to quickly format the text as a certain type
    type?: string,
    onClick?: (props, event) => void
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
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
