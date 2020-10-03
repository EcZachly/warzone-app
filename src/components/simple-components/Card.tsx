import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Card = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <div className={classNames} style={props.style} onClick={() => {
            if (TypeService.isFunction(props.onClick)) {
                props.onClick();
            }
        }}>
            {props.children}
        </div>
    );
};
export default Card;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Card.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    onClick: PropTypes.func,
    
    //a value between 1 and 5 will adjust the shadow depth
    shadow: PropTypes.oneOf([1, 2, 3, 4, 5])
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'card'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (TypeService.isFunction(props.onClick)) {
        classNames.push('clickable');
    }
    
    if (Number.isInteger(props.shadow) && props.shadow > 0 && props.shadow <= 5) {
        classNames.push('box-shadow-' + props.shadow);
    } else {
        classNames.push('box-shadow-1');
    }
    
    return classNames.join(' ');
}