import React from 'react';
import PropTypes from 'prop-types';

import Image from './Image';

const CONSTANTS = {
    VALID_POSITIONS: {
        'top': 'align-self-start',
        'start': 'align-self-start',
        'middle': 'align-self-center',
        'center': 'align-self-center',
        'end': 'align-self-end',
        'bottom': 'align-self-end'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const MediaImage = (props) => {
    const classNames = getClassNames(props);
    const style = getStyle(props);
    
    return (
        <Image {...props} className={classNames} style={style}/>
    );
};
export default MediaImage;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

MediaImage.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The vertical position of the image, relative to the rest of the media body
    position: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_POSITIONS)),
    
    //Whether the image appears before or after the media body
    order: PropTypes.oneOf(['end', 'last'])
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'media-image'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    classNames.push(getPosition(props));
    
    return classNames.join(' ');
}


function getPosition(props) {
    const defaultPosition = 'top';
    const validPositions = CONSTANTS.VALID_POSITIONS;
    
    return (props.position && validPositions[props.position]) ? validPositions[props.position] : validPositions[defaultPosition];
}


function getStyle(props) {
    let style = {};
    
    if (TypeService.isObject(props.style)) {
        style = {...style, ...props.style};
    }
    
    if (props.order === 'end' || props.order === 'last') {
        style.order = 2;
    }
    
    return style;
}