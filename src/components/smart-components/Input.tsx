import React from 'react';
import PropTypes from 'prop-types';

import {
    InputText,
    InputSelect,
    InputNumber,
    InputDate,
    InputCheckbox,
    Label,
    InputRadio,
    TextArea,
    Required,
    FormGroup,
    Paragraph
} from './../SimpleComponents';

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


class Input extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    
    render() {
        const props = this.props;
        
        const formError = this._getFormError(props);
        const helpMessage = this._getFormHelpMessage(props);
        const inputItem = this._getInput(props);
        
        let labelSize;
        
        if (props.labelSize) {
            labelSize = props.labelSize;
        } else if (props.mode === 'plain') {
            labelSize = 'sm';
        }
        
        let classNames = [props.className];
        
        if (this._isCheckbox()) {
            classNames.push('form-group-checkbox');
        }
        
        classNames = classNames.join(' ');
        
        return (
            <FormGroup className={classNames} style={props.style} mode={props.mode}>
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
    
    
    _getInput(props) {
        const inputStyle = {marginBottom: 0, ...props.inputStyle};
        
        const mappedType = this._getMappedType();
        
        if (mappedType === 'text') {
            return (
                <InputText onChange={props.onChange}
                           focus={props.focus}
                           style={inputStyle}
                           innerRef={props.innerRef}
                           mode={props.mode}
                           type={props.type}
                           textCenter={props.textCenter}
                           hasError={!!props.errorMessage}
                           onEnter={props.onEnter}
                           disabled={props.disabled}
                           placeholder={props.placeholder}
                           value={props.value}/>
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
                             value={props.value}
                             options={props.options}/>
            );
        } else if (mappedType === 'date') {
            return (
                <InputDate onChange={props.onChange}
                           focus={props.focus}
                           style={inputStyle}
                           hasError={!!props.errorMessage}
                           disabled={props.disabled}
                           value={props.value}
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
                               value={props.value}
                               options={props.options}/>
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
                             value={props.value}
                             options={props.options}/>
            );
        } else if (mappedType === 'radio') {
            return (
                <InputRadio onChange={props.onChange}
                            focus={props.focus}
                            style={inputStyle}
                            innerRef={props.innerRef}
                            name={props.name}
                            hasError={!!props.errorMessage}
                            disabled={props.disabled}
                            value={props.value}
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
                          value={props.value}
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

const ForwardedRefInput = React.forwardRef((props, ref) => <Input innerRef={ref} {...props}/>);

export default ForwardedRefInput;