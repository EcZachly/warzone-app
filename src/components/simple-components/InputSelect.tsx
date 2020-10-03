import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputSelect extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props: InputSelectProps) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props as InputSelectProps;
        const classNames = this._getClasses(props);
        const selectOptions = this._getSelectOptions(props);
        
        return (
            <select className={classNames}
                    disabled={props.disabled}
                    style={props.style}
                    value={props.value as string}
                    onChange={(event) => {
                        if (props.onChange) {
                            const value = event.target.value;
                            props.onChange(value, props, {value, event, props});
                        }
                    }}>
                {selectOptions}
            </select>
        );
    }
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    _getClasses(props) {
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
        
        return classNames.join(' ');
    }
    
    
    
    _getSelectOptions(props) {
        const options = props.options;
        
        if (Array.isArray(options) === false) {
            console.warn('InputRadio.props.options (Array) is required');
        } else if (options.length <= 0) {
            console.warn('InputRadio.props.options (Array) cannot be empty');
        } else {
            return options.map((option, index) => {
                if (typeof option !== 'object') {
                    console.warn(`InputRadio.props.options[${index}] (Object) is required`);
                } else {
                    const optionKeys = Object.keys(option);
                    
                    if (optionKeys.includes('value') === false) {
                        console.warn(`InputRadio.props.options[${index}].value (*) is required`);
                    } else if (optionKeys.includes('text') === false) {
                        console.warn(`InputRadio.props.options[${index}].text (String) is required`);
                    } else {
                        const {value, text} = option;
                        
                        return (
                            <option value={value} key={`${index}-${value}`}>{text}</option>
                        );
                    }
                }
            });
        }
    }
    
    
    
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type InputSelectProps = {
    className?: string,
    style?: object,
    children?: React.ReactNode,
    
    //When the input changes, this function will be called
    onChange: Function,
    
    //The list of possible radio options that the user can select from
    options: Array<object>
    
    //The value of the input
    value: string |number | boolean
    
    //If true, this will set the focus automatically when the input is loaded
    focus: boolean,
    
    //disables the input and prevents the user from entering any information
    disabled: boolean,
    
    //Adds some error stylings to the input
    hasError: boolean
};

export default InputSelect;