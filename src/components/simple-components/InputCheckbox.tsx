import React from 'react';
import TypeService from '../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputCheckbox extends React.Component<InputCheckboxProps> {

    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//


    constructor(props: InputCheckboxProps) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const props = this.props;

        const classes = this.getClasses(props);
        const hasOnChange = TypeService.isFunction(props.onChange);

        return (
            <input type={'checkbox'}
                   checked={!!props.value}
                   style={props.style}
                   disabled={props.disabled}
                   ref={props.innerRef}
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
        const classNames = [
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
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode,

    //When the input changes, this function will be called
    onChange?: (string, InputCheckboxProps, {value, event, props}) => void,

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

    focus?: boolean,
    innerRef?: any
};


export default InputCheckbox;