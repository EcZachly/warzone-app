import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Card = (props: CardProps) => {
    const classNames = getClassNames(props);

    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef} onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            {props.children}
        </div>
    );
};
export default Card;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type CardProps = {
    className?: string,
    style?: React.CSSProperties,
    isClickable?: boolean,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    shadow?: 1 | 2 | 3 | 4 | 5,
    onClick?:  () => void
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'card'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    if (props.onClick) {
        classNames.push('clickable');
    }

    if (Number.isInteger(props.shadow) && props.shadow > 0 && props.shadow <= 5) {
        classNames.push('box-shadow-' + props.shadow);
    } else {
        classNames.push('box-shadow-1');
    }

    return classNames.join(' ');
}