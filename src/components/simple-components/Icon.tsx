import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const Icon = (props) => {
    let itemProps = {...props};
    
    itemProps.className = (typeof itemProps.className === 'string') ? itemProps.className : '';
    itemProps.className = 'icon ' + itemProps.className;
    
    delete itemProps.noPosition;
    
    return (
        <p>NOT IMPLEMENTED</p>
    );
};
export default Icon;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Icon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    icon: PropTypes.string
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

