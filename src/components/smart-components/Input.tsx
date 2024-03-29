import React from 'react';

import {
    FormGroup,
    InputCheckbox,
    InputDate,
    InputNumber,
    InputRadio,
    InputSelect,
    InputText,
    Label,
    Paragraph,
    Required,
    TextArea
} from './../SimpleComponents';
import CSS from 'csstype';
import {AnyObject} from '../../../lib/components/Types';

const MODULE_CONSTANTS = {
    TYPE_MAP: {
        'text': 'text',
        'password': 'text',
        'email': 'text',
        'phone': 'text',
        'checkbox': 'checkbox',
        'select': 'select',
        'radio': 'radio',
        'textarea': 'textarea',
        'number': 'number',
        'date': 'date'
    }
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class Input extends React.Component<InputType> {

    constructor(props: InputType) {
        super(props);
    }


    render() {
        const props: InputType = this.props;

        const formError = this._getFormError(props);
        const helpMessage = this._getFormHelpMessage(props);
        const inputItem = this._getInput(props);

        let labelSize;

        if (props.mode === 'plain') {
            labelSize = 'sm';
        }

        if (props.labelSize) {
            labelSize = props.labelSize;
        }

        const classNames = [props.className];

        if (this._isCheckbox()) {
            classNames.push('form-group-checkbox');
        }

        const classNamesString = classNames.join(' ');

        return (
            <FormGroup className={classNamesString} style={props.style} mode={props.mode}>

                <Label size={labelSize}>
                    {props.label}

                    {props.required === true ? <Required/> : null}
                </Label>
                {inputItem}
                {helpMessage}
                {formError}
            </FormGroup>
        );
    }

    //====--=-=--=--=-=-=-==-=-=--=====--=-=--=--=-=-=-==-=-=--=//
    //PUBLIC METHODS



    //====--=-=--=--=-=-=-==-=-=--=====--=-=--=--=-=-=-==-=-=--=//
    //PRIVATE METHODS


    _getInput(props: InputType) {
        const inputStyle = {marginBottom: 0, ...props.inputStyle};
        const {radioStyle} = props;

        const mappedType = this._getMappedType();

        if (mappedType === 'text') {
            return (
                <InputText onChange={props.onChange}
                           focus={props.focus}
                           style={inputStyle}
                           size={props.size}
                           innerRef={props.innerRef}
                           mode={props.mode}
                           type={props.subtype || props.type}
                           textCenter={props.textCenter}
                           hasError={!!props.errorMessage}
                           onEnter={props.onEnter}
                           disabled={props.disabled}
                           placeholder={props.placeholder}
                           value={props.value as string}/>
            );
        } else if (mappedType === 'number') {
            return (
                <InputNumber onChange={props.onChange}
                             innerRef={props.innerRef}
                             focus={props.focus}
                             mode={props.mode}
                             style={inputStyle}
                             hasError={!!props.errorMessage}
                             disabled={props.disabled}
                             value={props.value as string}/>
            );
        } else if (mappedType === 'date') {

            return (
                <InputDate onChange={props.onChange}
                           focus={props.focus}
                           style={inputStyle}
                           hasError={!!props.errorMessage}
                           disabled={props.disabled}
                           value={props.value as string}
                           innerRef={props.innerRef}/>
            );
        } else if (mappedType === 'checkbox') {
            return (
                <InputCheckbox onChange={props.onChange}
                               innerRef={props.innerRef}
                               focus={props.focus}
                               style={inputStyle}
                               hasError={!!props.errorMessage}
                               disabled={props.disabled}
                               value={props.value as any}/>
            );
        } else if (mappedType === 'select') {
            return (
                <InputSelect onChange={props.onChange}
                             innerRef={props.innerRef}
                             focus={props.focus}
                             mode={props.mode}
                             style={inputStyle}
                             hasError={!!props.errorMessage}
                             disabled={props.disabled}
                             value={props.value as string}
                             options={props.options}/>
            );
        } else if (mappedType === 'radio') {
            return (

                <InputRadio onChange={props.onChange}
                            focus={props.focus}
                            style={inputStyle}
                            radioStyle={radioStyle}
                            innerRef={props.innerRef}
                            name={props.name}
                            hasError={!!props.errorMessage}
                            disabled={props.disabled}
                            value={props.value as (string | number | boolean)}
                            options={props.options}/>
            );
        } else if (mappedType === 'textarea') {
            return (
                <TextArea onChange={props.onChange}
                          focus={props.focus}
                          style={inputStyle}
                          mode={props.mode}
                          innerRef={props.innerRef}
                          hasError={!!props.errorMessage}
                          disabled={props.disabled}
                          placeholder={props.placeholder}
                          value={props.value as string}
                          textCenter={props.textCenter}/>
            );
        }
    }



    _getMappedType() {
        const type = this.props.type;
        const validTypes = Object.keys(MODULE_CONSTANTS.TYPE_MAP);
        const isValidType = validTypes.includes(type);
        const defaultMappedType = 'text';

        return (isValidType) ? MODULE_CONSTANTS.TYPE_MAP[type] : defaultMappedType;
    }



    _isCheckbox() {
        return this._getMappedType() === 'checkbox';
    }



    _getFormError(props) {
        if (props.errorMessage) {
            return (
                <Paragraph type={'error'}>{props.errorMessage}</Paragraph>
            );
        } else {
            return '';
        }
    }


    _getFormHelpMessage(props) {
        if (props.helpMessage) {
            return (
                <Paragraph type={'help'}>{props.helpMessage}</Paragraph>
            );
        } else {
            return '';
        }
    }
}


type Option = {
    value: any,
    text: string
}

type InputType = {
    className?: string | Array<string>,
    style?: CSS.Properties,
    radioStyle?: CSS.Properties,
    inputStyle?: CSS.Properties,
    children?: React.ReactNode,
    type?: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'radio' | 'textarea',
    subtype?: 'password' | 'email',
    focus?: boolean,
    onChange: (string) => void,
    ref?: any,
    innerRef?: any,
    mode?: string,
    errorMessage?: string,
    disabled?: boolean,
    size?: 'xl' | 'lg' | 'md' | 'sm',
    placeholder?: string,
    value?: string | number | boolean,
    textCenter?: boolean,
    onEnter?: () => void,
    labelSize?: string,
    label?: string,
    required?: boolean,
    helpMessage?: string,
    name?: string,
    options?: Option[]
}


const ForwardedRefInput = React.forwardRef<HTMLInputElement, InputType>((props, ref) => <Input
    innerRef={ref} {...props}/>);

export default ForwardedRefInput;