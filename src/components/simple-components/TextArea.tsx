import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class TextArea extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    
    render() {
        const props = this.props;
        const classNames = this.getClassNames(props);
        
        return (
            <textarea className={classNames}
                      style={props.style}
                      value={props.value}
                      ref={props.innerRef}
                      data-has-on-change={!!props.onChange}
                      placeholder={props.placeholder}
                      disabled={props.disabled}
                      onChange={(event) => {
                          if (props.onChange) {
                              const value = event.target.value;
                              props.onChange(value, props, {value, event, props});
                          }
                      }}>
            </textarea>
        );
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    getClassNames(props) {
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
    
    
    
    //===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
    //PRIVATE METHODS
    
    
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

let ForwardedRefTextArea = React.forwardRef((props, ref) => <TextArea innerRef={ref} {...props}/>);

TextArea.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //When the input changes, this function will be called
    onChange: PropTypes.func,
    
    //The value of the input
    value: PropTypes.string,
    
    //The placeholder for the element
    placeholder: PropTypes.string,
    
    //disables the input and prevents the user from entering any information
    disabled: PropTypes.bool,
    
    //Adds some error stylings to the input
    hasError: PropTypes.bool
};

ForwardedRefTextArea.propTypes = TextArea.propTypes;

export default ForwardedRefTextArea;