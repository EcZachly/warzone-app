import React from 'react';
import PropTypes from 'prop-types';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputNumber extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props;
        
        const classes = this.getClasses(props);
        
        return (
            <input value={props.value}
                   style={props.style}
                   placeholder={props.placeholder}
                   type={'number'}
                   disabled={props.disabled}
                   ref={props.innerRef}
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
        
        if (props.textCenter === true) {
            classNames.push('text-center');
        }
        
        return classNames.join(' ');
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

const ForwardedRefInputNumber = React.forwardRef((props, ref) => <InputNumber innerRef={ref} {...props}/>);

InputNumber.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //When the input changes, this function will be called
    onChange: PropTypes.func,
    
    //The value of the input
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    
    //The placeholder for the element
    placeholder: PropTypes.string,
    
    //disables the input and prevents the user from entering any information
    disabled: PropTypes.bool,
    
    //Adds some error stylings to the input
    hasError: PropTypes.bool,
    
    //center the text inside the input
    textCenter: PropTypes.bool
};

ForwardedRefInputNumber.propTypes = InputNumber.propTypes;

export default ForwardedRefInputNumber;