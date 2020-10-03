import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';
import CSS from "csstype";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputRadio extends React.Component<InputRadioProps> {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
    
    }
    
    render() {
        const props = this.props;
        const radioInputs = this._getRadioInputs(props);
        
        return (
            <React.Fragment>
                {radioInputs}
            </React.Fragment>
        );
    }
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    _getRadioInputs(props) {
        const options = props.options;
        const selectedValue = props.value;
        const name = props.name;
        
        if (TypeService.isArray(options) === false) {
            throw new Error('InputRadio.props.options (Array) is required');
        } else if (options.length <= 0) {
            throw new Error('InputRadio.props.options (Array) cannot be empty');
        } else {
            return options.map((option, index) => {
                if (TypeService.isObject(option) === false) {
                    throw new Error(`InputRadio.props.options[${index}] (Object) is required`);
                } else {
                    const {value, text, className} = option;
                    const isChecked = (selectedValue === value);
                    
                    return (
                        <div className={'form-check ' + className} key={`${index}-${value}`}>
                            <input name={name}
                                   type={'radio'}
                                   checked={isChecked}
                                   className={'form-check-input'}
                                   disabled={!!props.disabled}
                                   onChange={() => {
                                       if (props.onChange) {
                                           props.onChange(value, option);
                                       }
                                   }}/>
                            <label className={'form-check-label'}>{text}</label>
                        </div>
                    );
                }
            });
        }
    }
    
    
    
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS


type InputRadioProps = {
    options: Array<Object>,
    name: string,
    onChange: Function,

    className?: string | Array<String>,
    style?: CSS.Properties,
    children?: React.ReactNode,

    hasError?: boolean,
    disabled?: boolean,
    title?: string,
    value?: string | number | boolean,
    id?: string,
    ref?: any,
    innerRef?: any
}

export default InputRadio;