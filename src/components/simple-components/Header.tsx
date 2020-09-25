import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_SIZES: {
        'large': 'h1',
        'medium': 'h2',
        'small': 'h3',
        'extra-small': 'h4',
        'extra-extra-small': 'h5',
        'extra-extra-extra-small': 'h6',
        'lg': 'h1',
        'md': 'h2',
        'sm': 'h3',
        'xs': 'h4',
        'xl': 'h1',
        'xxl': 'h1',
        'extra-large': 'h1',
        'extra-extra-large': 'h1',
        'xxs': 'h5',
        'xxxs': 'h6',
        'default': 'h1'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



function Header(props) {
    const textTitle = props.children;
    const HeaderTag = getHeaderSize(props);
    const classNames = getClassNames(props, HeaderTag);
    
    return (
        <HeaderTag id={props.id} className={classNames} style={props.style}>
            {textTitle}
        </HeaderTag>
    );
}
export default Header;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Header.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //changes the size and tag of the rendered component
    size: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_SIZES)),
    
    //Centers the text
    textCenter: PropTypes.bool,
    
    //Removes the padding from the top of the header tag
    noTopPadding: PropTypes.bool,
    
    //bolds the text
    bold: PropTypes.bool,
    
    italic: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getHeaderSize(props) {
    let selectedSize = (typeof props.size === 'string' && props.size.length > 0) ? props.size.trim() : '';
    const validSizes = CONSTANTS.VALID_SIZES;
    
    return (validSizes[selectedSize]) ? validSizes[selectedSize] : validSizes['default'];
}


function getClassNames(props, HeaderTag) {
    let classes = [
        'header'
    ];
    
    if (props.size === 'xl' || props.size === 'extra-large') {
        classes.push('xl');
    } else if (props.size === 'xxl' || props.size === 'extra-extra-large') {
        classes.push('xxl');
    }
    
    if (props.textCenter === true) {
        classes.push('text-center');
    }
    
    if (props.noTopPadding === true) {
        classes.push('no-top-padding');
    }
    
    if (props.bold === true) {
        classes.push('bold');
    }
    
    if (props.italic === true) {
        classes.push('italic');
    }
    
    if (props.className) {
        classes.push(props.className);
    }
    
    return classes.join(' ');
}