import React from 'react';
import PropTypes from 'prop-types';
import TypeService from "../../services/TypeService";
import CSS from "csstype";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputCheckbox extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props: InputCheckboxProps) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props;

        const classes = this.getClasses(props);
        const hasOnChange = TypeService.isFunction(props['onChange']);
        
        return (
            <input type={'checkbox'}
                   checked={!!props['value']}
                   style={props['style']}
                   disabled={props['disabled']}
                   ref={props['innerRef']}
                   className={classes}
                   data-has-on-change={hasOnChange}
                   onChange={(event) => {
                       if (hasOnChange) {
                           const value = event.target.checked;
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


type InputCheckboxProps = {
    className: string,
    style: CSS.Properties,
    children: React.ReactNode,
    
    //When the input changes, this function will be called
    onChange: Function,
    
    //The value of the input
    value: string | number,
    
    //The placeholder for the element
    placeholder: string,
    
    //disables the input and prevents the user from entering any information
    disabled: boolean,
    
    //Adds some error stylings to the input
    hasError: boolean,
    
    //center the text inside the input
    textCenter: boolean,
    
    innerRef: any
};


export default InputCheckbox;