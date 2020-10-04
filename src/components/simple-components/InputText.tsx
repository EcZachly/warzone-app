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
    
    
    constructor(props: InputTextProps) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props as InputTextProps;
        
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
                       if (props['onChange']) {
                           const value = event.target.value;
                           props['onChange'](value, props, {value, event, props});
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

        if (['xl', 'lg', 'md', 'sm'].includes(props.size)) {
            classNames.push('input-size-' + props.size);
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
type InputTextProps = {
    className?: string,
    style?: object,
    children?: React.ReactNode,
    innerRef?: any,

    //When the input changes, this function will be called
    onChange?: Function,

    onEnter?: Function,
    
    //The value of the input
    value?: string,

    size?: string,

    //If true, this will set the focus automatically when the input is loaded
    focus?: boolean,
    
    //The type of the input
    type?: string,
    
    //The placeholder for the element
    placeholder?: string,
    
    //disables the input and prevents the user from entering any information
    disabled?: boolean,
    
    //Adds some error stylings to the input
    hasError?: boolean,
    
    //center the text inside the input
    textCenter?: boolean
};


export default InputText;