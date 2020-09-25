import React from 'react';
import PropTypes from 'prop-types';

import Image from './Image';
import Icon from './Icon';
import Box from './Box';

const CONSTANTS = {
    VALID_POSITIONS: ['top', 'bottom', 'both'],
    DEFAULT_POSITION: 'top'
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const CardIcon = (props) => {
    const classNames = getClassNames(props);
    const children = getChildren(props);
    
    return (
        <Box className={classNames} style={{
            padding: '50px',
            background: props.background,
            ...props.style
        }}>
            {children}
        </Box>
    );
};
export default CardIcon;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

CardIcon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The image source of the icon to be rendered
    src: PropTypes.string,
    
    //The image description
    alt: PropTypes.string,
    
    icon: Icon.propTypes.icon,
    
    //The color you want the icon to appear
    color: PropTypes.string,
    
    //The background color you want the icon to have
    background: PropTypes.string,
    
    //Indicating where the icon will be placed on the card, so the proper corner roundings can be applied
    position: PropTypes.oneOf(CONSTANTS.VALID_POSITIONS),
    
    //Choosing to not have any position indicated for the card icon
    noPosition: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getChildren(props) {
    if (props.src) {
        return (
            <Image style={{width: '90px', height: '90px'}}
                   alt={props.alt}
                   src={props.src}/>
        );
    } else {
        let style = {};
        
        if (props.color) {
            style.color = props.color;
        }
        
        return (
            <Icon {...props} style={style}/>
        );
    }
}


function getClassNames(props) {
    let classNames = [
        'card-img'
    ];
    
    const validPositions = CONSTANTS.VALID_POSITIONS;
    let selectedPosition = CONSTANTS.DEFAULT_POSITION;
    
    if (validPositions.includes(props.position)) {
        selectedPosition = props.position;
    }
    
    if (props.noPosition !== true) {
        classNames.push('card-img-' + selectedPosition);
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}




