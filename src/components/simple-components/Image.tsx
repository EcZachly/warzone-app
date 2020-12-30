import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';
//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

type ImageProps = {
    src: string,

    alt?: string,
    className?: string,
    style?: React.CSSProperties,
    id?: string,
    title?: string,
    innerRef?: any,
    onClick?: () => void,
    clickHover?: boolean
};


const Image = (props: ImageProps) => {
    const classNames = getClassNames(props);

    return (
        <img {...props}
             id={props.id}
             title={props.title}
             src={props.src}
             alt={props.alt || ''}
             ref={props.innerRef}
             onClick={() => {
                 if (props.onClick) {
                     props.onClick();
                 }
             }}
             className={classNames}
             style={props.style}/>
    );
};

export default Image;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [];

    if (props.className) {
        classNames.push(props.className);
    }

    if (props.onClick) {
        classNames.push('has-click');
    }

    if (props.onClick && props.clickHover) {
        classNames.push('click-hover');
    }

    return classNames.join(' ');
}