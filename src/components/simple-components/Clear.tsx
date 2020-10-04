import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Clear = (props: ClearProps) => {
    const classNames = getClassNames(props);

    return (
        <div className={classNames} style={props.style}>
            {props.children}
        </div>
    );
};
export default Clear;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type ClearProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'clear'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}