import React from 'react';
import TypeService from './../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

type PlaceholderTypes = {
    className?: string | Array<string>,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    title?: boolean,
    text?: boolean,
    paragraph?: boolean,
    block?: boolean,
    inline?: boolean,
    clear?: boolean,
}

export default function Placeholder(props: PlaceholderTypes) {
    const tempProps = {...props};

    const classes = getClassNames(props);
    const style = getStyle(props);

    if (TypeService.isBoolean(tempProps.title)) {
        delete tempProps.title;
    }

    if (TypeService.isBoolean(tempProps.block)) {
        delete tempProps.block;
    }

    if (TypeService.isBoolean(tempProps.inline)) {
        delete tempProps.inline;
    }

    return (
        <p style={style} className={classes}/>
    );
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'placeholder'
    ];

    if (props.block === true) {
        classNames.push('display-block');
    }

    if (props.inline === true) {
        classNames.push('display-inline-block');
    }

    if (props.paragraph === true) {
        classNames.push('paragraph');
    }

    if (props.title === true) {
        classNames.push('title');
    }

    if (props.text === true) {
        classNames.push('text');
    }

    if (props.className) {
        classNames.push(props.className);
    }

    return classNames.join(' ');
}


function getStyle(props) {
    const defaultStyle = {
        width: '10rem'
    };

    if (props.width) {
        defaultStyle.width = props.width;
    }

    return {...defaultStyle, ...props.style};
}