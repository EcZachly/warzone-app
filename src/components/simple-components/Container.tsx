import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {
    VALID_SIZES: {
        'sm': 'sm',
        'small': 'sm',
        'lg': 'lg',
        'large': 'lg'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Container = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div id={props.id} className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Container;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Container.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    id: PropTypes.string,

    //Changes the width of the container
    size: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_SIZES)),
    
    //Centers the children inside the container vertically and horizontally
    centerContent: PropTypes.bool,
    inline: PropTypes.bool,
    flex: PropTypes.bool,
    mode: PropTypes.oneOf(['sidebar', undefined])
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'container'
    ];
    
    classNames.push(getSize(props));
    
    if (props.centerContent === true) {
        classNames.push('center-content');
    }
    
    if (props.inline === true) {
        classNames.push('inline');
    }
    
    if (props.flex === true) {
        classNames.push('flex');
    }
    
    if (props.mode === 'sidebar') {
        classNames.push('sidebar-container');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function getSize(props) {
    const propSize = props.size;
    
    const validSizes = CONSTANTS.VALID_SIZES;
    
    return (validSizes[propSize]) ? `container-${validSizes[propSize]}` : '';
}