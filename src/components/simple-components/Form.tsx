import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Form = (props: FormProps) => {
    const classNames = getClassNames(props);

    return (
        <form  {...props}
               className={classNames}
               style={props.style}
               data-has-on-submit={!!props.onSubmit}
               ref={props.innerRef}
               onSubmit={(event) => {
                   event.preventDefault();

                   if (props.onSubmit) {
                       props.onSubmit(props, event);
                   }
               }}>
            {props.children}
        </form>
    );
};
export default Form;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type FormProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    onSubmit?: (FormProps, any) => void
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        ''
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}