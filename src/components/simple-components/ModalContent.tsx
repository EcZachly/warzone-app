import React from 'react';
import PropTypes from 'prop-types';

import {ModalShouldBeClosedContext} from './support/ModalShouldBeClosedContext';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const ModalContent = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <ModalShouldBeClosedContext.Consumer>
            {(({ModalShouldBeClosedContext, changeModalCloseValue}) => {
                return (
                    <div className={classNames} style={props.style} onClick={() => {
                        changeModalCloseValue(false);
                    }}>
                        {props.children}
                    </div>
                );
            })}
        </ModalShouldBeClosedContext.Consumer>
    );
};
export default ModalContent;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ModalContent.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'modal-content'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}