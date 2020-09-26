import React from 'react';
import PropTypes from 'prop-types';

import Image from './Image';

const CONSTANTS = {
    VALID_POSITIONS: ['top', 'bottom', 'both'],
    DEFAULT_POSITION: 'top'
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const CardImage = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <Image {...props} className={classNames}/>
    );
};
export default CardImage;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

CardImage.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //Indicating where the icon will be placed on the card, so the proper corner roundings can be applied
    position: PropTypes.oneOf(CONSTANTS.VALID_POSITIONS),
    
    //Choosing to not have any position indicated for the card icon
    noPosition: PropTypes.bool,
    
    ...Image.propTypes
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

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