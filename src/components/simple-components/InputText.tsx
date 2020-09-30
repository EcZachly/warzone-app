import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';
const CONSTANTS = {
    VALID_TYPES: {
        'text': 'text',
        'password': 'password',
        'email': 'email',
        'phone': 'phone'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputText extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props;
        
        const classes = this.getClasses(props);
        const type = this.getType(props);
        
        return (
            <input value={props.value}
                   placeholder={props.placeholder}
                   type={type}
                   style={props.style}
                   disabled={props.disabled}
                   ref={props.innerRef}
                   autoFocus={props.focus === true}
                   data-has-focus={!!props.focus}
                   onKeyPress={(event) => {
                            if (event.key === 'Enter' && TypeService.isFunction(props.onEnter)) {
                                props.onEnter(event);
                            }
                   }}
                   className={classes}
                   data-has-on-change={!!props.onChange}
                   onChange={(event) => {
                       if (props.onChange) {
                           const value = event.target.value;
                           props.onChange(value, props, {value, event, props});
                       }
                   }}/>
        );
    }
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    
    getClasses(props) {
        let classNames = [
            'form-control'
        ];
        
        if (props.className) {
            classNames.push(props.className);
        }
        
        if (props.mode === 'plain') {
            classNames.push('input-plain');
        }
        
        if (props.hasError) {
            classNames.push('has-error');
        }
        
        if (props.textCenter) {
            classNames.push('text-center');
        }
        
        return classNames.join(' ');
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    
    getType(props) {
        const selectedType = props.type;
        const defaultType = 'text';
        const typeOptions = CONSTANTS.VALID_TYPES;
        
        if (!typeOptions[selectedType]) {
            return typeOptions[defaultType];
        } else {
            return typeOptions[selectedType];
        }
    }
    
    
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

const ForwardedRefInputText = React.forwardRef((props, ref) => <InputText innerRef={ref} {...props}/>);

InputText.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    innerRef: PropTypes.func,
    
    //When the input changes, this function will be called
    onChange: PropTypes.func,
    
    //The value of the input
    value: PropTypes.string,
    
    //If true, this will set the focus automatically when the input is loaded
    focus: PropTypes.bool,
    
    //The type of the input
    type: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_TYPES)),
    
    //The placeholder for the element
    placeholder: PropTypes.string,
    
    //disables the input and prevents the user from entering any information
    disabled: PropTypes.bool,
    
    //Adds some error stylings to the input
    hasError: PropTypes.bool,
    
    //center the text inside the input
    textCenter: PropTypes.bool
};

ForwardedRefInputText.propTypes = InputText.propTypes;

export default ForwardedRefInputText;