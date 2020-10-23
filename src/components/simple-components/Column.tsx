import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Column = (props: ColumnProps) => {
    const classNames = getClassNames(props);

    return (
        <div {...props} className={classNames} style={props.style} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default Column;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type ColumnProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    innerRef?: any,
    'size-xs'?: number,
    'size-sm'?: number,
    'size-md'?: number,
    'size-lg'?: number
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'column',
        'col'
    ];

    if (props.className) {
        classNames.push(props.className);
    }

    classNames.push(getSize(props));

    return classNames.join(' ');
}


function getSize(props) {
    const validSizes = ['xs', 'sm', 'md', 'lg'];

    return validSizes.filter((size) => {
        return !!props[size] || isNaN(props[size]) === false;
    }).map((size) => {
        return `col-${size}-${props[size]}`;
    }).join(' ');
}