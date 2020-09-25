import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputCheckbox extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props;
        
        const {value, style, innerRef, disabled, onChange} = props;
        
        const classes = this.getClasses(props);
        const hasOnChange = TypeService.isFunction(onChange);
        
        return (
            <input type={'checkbox'}
                   checked={!!value}
                   style={style}
                   disabled={disabled}
                   ref={innerRef}
                   className={classes}
                   data-has-on-change={hasOnChange}
                   onChange={(event) => {
                       if (hasOnChange) {
                           const value = event.target.checked;
                           onChange(value, props, {value, event, props});
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

const ForwardedRefInputNumber = React.forwardRef((props, ref) => <InputCheckbox innerRef={ref} {...props}/>);

InputCheckbox.propTypes = {
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

ForwardedRefInputNumber.propTypes = InputCheckbox.propTypes;

export default ForwardedRefInputNumber;