import React from 'react';
import PropTypes from 'prop-types';

import TypeService from './../../services/TypeService';

const CONSTANTS = {
    VALID_SIZES: {
        'small': 'sm',
        'sm': 'sm',
        'large': 'lg',
        'lg': 'lg',
        'extra-large': 'xl',
        'xl': 'xl'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default class Modal extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
        
        this.state = {
            dialogueWasClicked: false
        };
        
        this.keydown = this.keydown.bind(this);
    }
    
    keydown(event) {
        if (event.keyCode === 27) { //escape key
            this.escapeKeyClicked(event);
        }
    }
    
    componentDidMount() {
        document.addEventListener('keydown', this.keydown, false);
    }
    
    componentWillUnmount() {
        if (this.props.show === true) {
            document.removeEventListener('keydown', this.keydown, false);
        }
    }
    
    
    
    escapeKeyClicked(event) {
        const props = this.props;
        
        if (props.show === true && props.disableEscapeClose !== true) {
            if (TypeService.isFunction(props.onEscapeClick)) {
                props.onEscapeClick();
            } else if (TypeService.isFunction(props.closeModal)) {
                props.closeModal();
            }
        }
    }
    
    
    
    render() {
        const props = this.props;
        
        const modal = this.getModal(props);
        const modalBackdrop = this.getModalBackdrop(props);
        
        return (
            <>
                {modal}
                {modalBackdrop}
            </>
        );
    }
    
    
    getModal(props) {
        if (props.show === true) {
            const modalClasses = this._getModalClasses(props);
            const modalDialogClasses = this._getModalDialogClasses(props);
            
            return (
                <div className={modalClasses}
                     style={{display: 'block', opacity: 1, ...props.style}}
                     onClick={() => {
                         setTimeout(() => {
                             if (this.state.dialogueWasClicked !== true) {
                                 this.backgroundClicked();
                             } else {
                                 this.setState({
                                     dialogueWasClicked: false
                                 });
                             }
                         }, 1);
                     }}>
                    <div className={modalDialogClasses} onClick={() => {
                        this.setState({
                            dialogueWasClicked: true
                        });
                    }}>
                        {props.children}
                    </div>
                </div>
            );
        } else {
            return ('');
        }
    }
    
    
    getModalBackdrop(props) {
        if (props.show === true) {
            const backdropClasses = this._getBackdropClasses(props);
            
            return (
                <div className={backdropClasses}/>
            );
        } else {
            return ('');
        }
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    backgroundClicked() {
        const props = this.props;
        
        if (props.disableBackgroundClose !== true) {
            if (TypeService.isFunction(props.onBackgroundClick)) {
                props.onBackgroundClick();
            } else if (TypeService.isFunction(props.closeModal)) {
                props.closeModal();
            }
        }
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    
    _getModalClasses(props) {
        let classes = [
            'modal'
        ];
        
        if (props.show === true) {
            classes.push('modal-open fade show');
        }
        
        if (props.className) {
            classes.push(props.className);
        }
        
        return classes.join(' ');
    }
    
    
    _getModalDialogClasses(props) {
        let classes = [
            'modal-dialog'
        ];
        
        if (props.centered === true) {
            classes.push('modal-dialog-centered');
        }
        
        if (props.size) {
            classes.push(this._getModalSize(props.size));
        }
        
        return classes.join(' ');
    }
    
    
    _getModalSize(size) {
        const validSizes = CONSTANTS.VALID_SIZES;
        
        //medium is the default size, but it doesn't have any class
        
        return (validSizes[size]) ? ('modal-' + validSizes[size]) : '';
    }
    
    
    
    _getBackdropClasses(props) {
        let classes = [
            'modal-backdrop'
        ];
        
        if (props.show === true) {
            classes.push('fade show');
        }
        
        return classes.join(' ');
    }
    
}

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    size: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_SIZES)),
    centered: PropTypes.bool,
    disableEscapeClose: PropTypes.bool,
    disableBackgroundClose: PropTypes.bool,
    closeModal: PropTypes.func,
    onBackgroundClick: PropTypes.func,
    onEscapeClick: PropTypes.func
};