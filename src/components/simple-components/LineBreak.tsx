import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const LineBreak = (props) => {
    const classNames = getClassNames(props);
    const Tag = getTag(props);
    
    return (
        <Tag className={classNames} style={props.style}/>
    );
};
export default LineBreak;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

LineBreak.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    noMargin: PropTypes.bool,
    noMargins: PropTypes.bool
};


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