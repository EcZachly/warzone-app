import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const FormGroup = (props: FormGroupProps) => {
    const classNames = getClassNames(props);

    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default FormGroup;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type FormGroupProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    mode: string
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'form-group'
    ];

    if (props.mode === 'plain') {
        classNames.push('form-group-plain');
    }

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}