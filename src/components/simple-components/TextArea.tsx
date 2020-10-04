import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class TextArea extends React.Component<TextAreaProps> {
    
    constructor(props) {
        super(props);
    }
    
    
    render() {
        const props = this.props;
        const classNames = this.getClassNames(props);
        
        return (
            <textarea className={classNames}
                      style={props.style}
                      value={props.value}
                      ref={props.innerRef}
                      data-has-on-change={!!props.onChange}
                      placeholder={props.placeholder}
                      disabled={props.disabled}
                      onChange={(event) => {
                          if (props.onChange) {
                              const value = event.target.value;
                              props.onChange(value, props, {value, event, props});
                          }
                      }}>
            </textarea>
        );
    }
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    getClassNames(props) {
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
        
        if (props.textCenter === true) {
            classNames.push('text-center');
        }
        
        return classNames.join(' ');
    }
    
    
    
    //===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
    //PRIVATE METHODS
    
    
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type TextAreaProps = {
    className?: string | Array<string>,
    style?: object,
    children?: React.ReactNode,
    focus?: boolean,
    onChange?: Function,
    ref?: any,
    innerRef?: any,
    hasError?: boolean,
    disabled?: boolean,
    placeholder?: string,
    value?: string,
    textCenter?: boolean,
    mode?: 'plain' | string
}


let ForwardedRefTextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => <TextArea innerRef={ref} {...props}/>);

export default ForwardedRefTextArea;