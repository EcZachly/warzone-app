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
    className?: String | Array<String>,
    style?: CSS.Properties,
    children?: React.ReactNode,
    noMargins?: Boolean,
    noMargin?: Boolean,
    clear?: Boolean
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
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
    return (props.clear === true) ? 'br' : 'hr';
}