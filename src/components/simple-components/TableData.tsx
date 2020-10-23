import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const TableData = (props: TableDataProps) => {
    const classNames = getClassNames(props);

    return (
        <td {...props} className={classNames} style={props.style} colSpan={props.colspan} ref={props.innerRef}>
            {props.children}
        </td>
    );
};

export default TableData;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type TableDataProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    colspan?: number,
    innerRef?: any
    align?: 'left' | 'center' | 'right'
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = ['table-data'];

    if (props.className) {
        classNames.push(props.className);
    }

    const validTextAlignPositions = ['left', 'right', 'center'];
    const alignPropValue = (props.align || props.textAlign || '').toLowerCase();

    if (validTextAlignPositions.includes(alignPropValue)) {
        classNames.push('text-' + alignPropValue);
    }


    return classNames.join(' ');
}