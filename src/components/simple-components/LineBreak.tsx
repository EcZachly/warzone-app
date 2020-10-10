import React from 'react';
import CSS from 'csstype';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function LineBreak(props: LineBreakProps) {
    const classNames = getClassNames(props);
    const Tag = getTag(props);

    return (
        <Tag className={classNames} style={props.style}/>
    );
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type LineBreakProps = {
    className?: string | Array<string>,
    style?: CSS.Properties,
    children?: React.ReactNode,
    noMargins?: boolean,
    noMargin?: boolean,
    clear?: boolean,
    blank?: boolean,
    br?: boolean
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'line-break'
    ];

    if (props.noMargin === true) {
        classNames.push('no-margins');
    }

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}


function getTag(props) {
    return (props.clear === true || props.blank === true || props.br === true) ? 'br' : 'hr';
}