import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const FormGroup = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default FormGroup;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

FormGroup.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'form-group'
    ];
    
    if (props.mode === 'plain') {
        classNames.push('form-group-plain');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}