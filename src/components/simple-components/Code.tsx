import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Code = (props: CodeProps) => {
    const classNames = getClassNames(props);

    return (
        <code className={classNames} style={props.style}>
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
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'code'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}