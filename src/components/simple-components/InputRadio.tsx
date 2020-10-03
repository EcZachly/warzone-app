import React from 'react';
import PropTypes from 'prop-types';
import TypeService from '../../services/TypeService';
//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputRadio extends React.Component {
    
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

InputRadio.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //When the input changes, this function will be called
    onChange: PropTypes.func.isRequired,
    
    //The list of possible radio options that the user can select from
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    
    //The value of the input
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    
    //The name of the group of radio options
    name: PropTypes.string.isRequired,
    
    //If true, this will set the focus automatically when the input is loaded
    focus: PropTypes.bool,
    
    //disables the input and prevents the user from entering any information
    disabled: PropTypes.bool,
    
    //Adds some error stylings to the input
    hasError: PropTypes.bool
};

export default InputRadio;