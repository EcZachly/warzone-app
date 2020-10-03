import React from 'react';
import PropTypes from 'prop-types';
import TypeService from "../../services/TypeService";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const ModalHeader = (props) => {
    const classNames = getClassNames(props);
    const closeButton = getCloseButton(props);
    
    
    return (
        <div className={classNames} style={props.style} data-has-on-close={!!props.onClose}>
            {props.children}
            {closeButton}
        </div>
    );
};
export default ModalHeader;


function getCloseButton(props) {
    if (TypeService.isFunction(props.onClose)) {
        return (
            <button type="button" className={'close'} aria-label="Close" onClick={() => {
                props.onClose();
            }}>
                <span aria-hidden="true">&times;</span>
            </button>
        );
    }
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ModalHeader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    onClose: PropTypes.func,
    noBorder: PropTypes.bool,
    closeOnly: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'modal-header'
    ];
    
    if (props.noBorder === true) {
        classNames.push('modal-header-no-border');
    }
    
    if (props.closeOnly === true) {
        classNames.push('modal-header-close-only modal-header-no-border');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}