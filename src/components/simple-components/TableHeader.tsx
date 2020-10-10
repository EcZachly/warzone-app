import * as React from 'react';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const TableHeader = (props: TableHeaderProps) => {
    const classNames = getClassNames(props);

    return (
        <th className={classNames} style={props.style}>
            {props.children}
        </th>
    );
};
export default TableHeader;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type TableHeaderProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    align?: 'left' | 'center' | 'right'
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = ['th'];

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