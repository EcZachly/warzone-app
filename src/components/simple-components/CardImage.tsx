import React from 'react';
import PropTypes from 'prop-types';

import Image from './Image';

const CONSTANTS = {
    VALID_POSITIONS: ['top', 'bottom', 'both'],
    DEFAULT_POSITION: 'top'
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const CardImage = (props: CardImageProps) => {
    const classNames = getClassNames(props);

    return (
        <Image {...props} className={classNames}/>
    );
};
export default CardImage;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CardImageProps = {
    src: string,
    alt?: string,

    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,

    noPosition?: boolean,
    background?: string,
    position?: typeof CONSTANTS.VALID_POSITIONS
}


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