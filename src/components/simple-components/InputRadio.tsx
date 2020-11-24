import React from 'react';
import TypeService from '../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputRadio extends React.Component<InputRadioProps> {

    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//


    constructor(props: InputRadioProps) {
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



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type Option = {
    value: string,
    text: string,
    className?: string
}

type InputRadioProps = {
    children?: React.ReactNode,
    style?: React.CSSProperties,
    className?: string | Array<string>,

    options: Option[],
    name: string,
    onChange: (string, OptionType) => void,
    focus?: boolean,

    hasError?: boolean,
    disabled?: boolean,
    title?: string,
    value?: string | number | boolean,
    id?: string,
    ref?: any,
    innerRef?: any
}

export default InputRadio;