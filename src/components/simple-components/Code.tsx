import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Code = (props: CodeProps) => {
    const classNames = getClassNames(props);

    return (
        <code {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </code>
    );
};
export default Code;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CodeProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'code'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}