import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const InputGroup = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default InputGroup;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

InputGroup.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'input-group'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}