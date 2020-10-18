import React from 'react';
import PropTypes from 'prop-types';

import {Column, Paragraph} from './../SimpleComponents';
import TypeService from './../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Placeholder = (props) => {
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
        <p {...tempProps} style={style} className={classes}/>
    );
};
export default Placeholder;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Placeholder.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    text: PropTypes.bool,
    clear: PropTypes.bool,
    block: PropTypes.bool,
    inline: PropTypes.bool,
    title: PropTypes.bool
};


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