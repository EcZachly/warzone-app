import React from 'react';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputNumber extends React.Component<InputNumberProps> {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props: InputNumberProps) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props as InputNumberProps;
        
        const classes = this.getClasses(props);
        
        return (
            <input {...props}
                   value={props.value}
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
        const classNames = [
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

type InputNumberProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    focus? : boolean,
    mode? : string,

    //When the input changes, this function will be called
    onChange?:  (string, InputNumberProps, {value, event, props}) => void,
    
    //The value of the input
    value?: string | number,
    
    //The placeholder for the element
    placeholder?: string,
    
    //disables the input and prevents the user from entering any information
    disabled?: boolean,
    
    //Adds some error stylings to the input
    hasError?: boolean,
    
    //center the text inside the input
    textCenter?: boolean,

    innerRef?: any
};


export default InputNumber;