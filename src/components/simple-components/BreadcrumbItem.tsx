import React from 'react';

import Link from './Link';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const BreadcrumbItem = (props: BreadcrumbItemProps) => {
    const classNames = getClassNames(props);

    return (
        <Link className={classNames} style={props.style} onClick={props.onClick}>
            {props.children}
        </Link>
    );
};
export default BreadcrumbItem;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type BreadcrumbItemProps = {
    onClick: Function,

    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    active?: boolean
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'breadcrumb-item'
    ];

    if (props.active === true) {
        classNames.push('active');
    }

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}