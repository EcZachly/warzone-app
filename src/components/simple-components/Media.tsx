import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Media = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Media;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Media.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //Add a border to the bottom of the media element
    border: PropTypes.bool,
    
    //Add a border to the bottom of the media element
    withBorder: PropTypes.bool,
    
    //Add a border to the bottom of the media element
    borderBottom: PropTypes.bool,
    
    //Add a border to the bottom of the media element
    bordered: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'media'
    ];
    
    if (props.border === true || props.withBorder === true || props.borderBottom === true || props.bordered === true) {
        classNames.push('media-border-bottom');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}