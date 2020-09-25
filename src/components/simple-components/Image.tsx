import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Image = (props) => {
    const classNames = getClassNames(props);
    
    if (TypeService.isString(props.alt) === false) {
        console.warn('props.alt is required (this is a description of the image)');
    }
    
    return (
        <img id={props.id} src={props.src} alt={props.alt || ''} className={classNames} style={props.style}/>
    );
};

export default Image;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Image.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    
    //the ID of the HTML element
    id: PropTypes.string,
    
    //the source of the image
    src: PropTypes.string.isRequired,
    
    //The description of the image
    alt: PropTypes.string.isRequired
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        ''
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}