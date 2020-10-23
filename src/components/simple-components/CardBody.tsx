import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const CardBody = (props:CardBodyProps) => {
    const classNames = getClassNames(props);
    
    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default CardBody;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CardBodyProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'card-body'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}