import React from 'react';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



const Main = (props: MainProps) => {
    const classNames = getClassNames(props);

    return (
        <main {...props} className={classNames} style={props['style']} ref={props.innerRef}>
            {props.children}
        </main>
    );
};

export default Main;


type MainProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'main'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}