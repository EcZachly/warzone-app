import React from 'react';
import PropTypes from 'prop-types';

const CONSTANTS = {VALID_TYPES: []};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class InputDate extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
        
        this.state = {
            dateObj: {
                input: '',
                pretty: '',
                error: null,
                hasError: null,
                isEmpty: null,
                isValid: null
            }
        };
    }
    
    
    componentDidMount() {
        if (this.props.value) {
            this.updateDateValue(moment(this.props.value).format('MM/DD/YYYY'));
        }
    }
    
    
    
    render() {
        const props = this.props;
        
        const classes = this.getClasses(props);
        
        return (
            <>
                <input value={this.state.dateObj.input}
                       placeholder={props.placeholder}
                       type={'date'}
                       style={{marginBottom: 5, ...props.style}}
                       disabled={props.disabled}
                       ref={props.innerRef}
                       autoFocus={props.focus === true}
                       data-has-focus={!!props.focus}
                       onKeyPress={(event) => {
                           if (event.key === 'Enter' && props.onEnter) {
                               props.onEnter(event);
                           }
                       }}
                       className={classes}
                       data-has-on-change={!!props.onChange}
                       onChange={(event) => {
                           const value = event.target.value;
                           this.updateDateValue(value);
                       }}/>
                
                <p className={'paragraph-' + (this.state.dateObj.hasError ? 'error' : 'help')}
                   style={{fontSize: '.75em', marginTop: '0px', paddingLeft: 5}}>
                    {this.state.dateObj.error || this.state.dateObj.pretty}
                </p>
            </>
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
        
        if (props.mode === 'plain') {
            classNames.push('input-plain');
        }
        
        if (props.hasError || this.state.dateObj.hasError) {
            classNames.push('has-error');
        }
        
        if (props.textCenter) {
            classNames.push('text-center');
        }
        
        return classNames.join(' ');
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    
    updateDateValue(newInputValue) {
        let newDateObj = {
            input: newInputValue,
            pretty: '',
            isEmpty: null,
            isValid: null,
            hasError: null,
            error: null
        };
        
        let value = null;
        
        newDateObj.isEmpty = newDateObj.input === '';
        newDateObj.isValid = (newDateObj.isEmpty === false && this.isDate(newInputValue, true));
        
        value = (newDateObj.isValid) ? new Date(newDateObj.input) : null;
        newDateObj.pretty = (newDateObj.isValid) ? moment(value).format('MMMM Do, YYYY') : '';
        
        if (newDateObj.isEmpty === false && newDateObj.isValid === false) {
            newDateObj.error = 'Invalid date format';
        }
        
        newDateObj.hasError = !!newDateObj.error;
        
        this.setState({
            dateObj: newDateObj
        });
        
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    
    
    
    isDate(item, allowString) {
        const isNotInvalidType = (item !== undefined && item !== null && isNaN(item) === true && item !== false && item !== true && Array.isArray(item) === false);
        const stringAllowance = (allowString !== true) ? typeof item === 'string' : true;
        
        if (isNotInvalidType && stringAllowance) {
            if (allowString === true) {
                item = new Date(item);
            }
            
            return ((item instanceof Date) && (item.toString() !== 'Invalid Date'));
            
        } else {
            return false;
        }
    }
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

const ForwardedRefInputDate = React.forwardRef((props, ref) => <InputDate innerRef={ref} {...props}/>);

InputDate.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    innerRef: PropTypes.func,
    
    //When the input changes, this function will be called
    onChange: PropTypes.func,
    
    //The value of the input
    value: PropTypes.string,
    
    //If true, this will set the focus automatically when the input is loaded
    focus: PropTypes.bool,
    
    //The type of the input
    type: PropTypes.oneOf(Object.keys(CONSTANTS.VALID_TYPES)),
    
    //The placeholder for the element
    placeholder: PropTypes.string,
    
    //disables the input and prevents the user from entering any information
    disabled: PropTypes.bool,
    
    //Adds some error stylings to the input
    hasError: PropTypes.bool,
    
    //center the text inside the input
    textCenter: PropTypes.bool
};

ForwardedRefInputDate.propTypes = InputDate.propTypes;

export default ForwardedRefInputDate;