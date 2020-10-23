import React from 'react';
import PropTypes from 'prop-types';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const ProgressBar = (props) => {
    const classNames = getClassNames(props);
    const style = getStyle(props);
    
    return (
        <div {...props} className={classNames} style={{...style, ...props.style}} ref={props.innerRef}>
            {props.children}
        </div>
    );
};
export default ProgressBar;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ProgressBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The height of the progress element
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
        'progress'
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function getStyle(props) {
    const style = {};
    
    if (props.height) {
        let heightValue = props.height;
        
        const defaultEnding = 'px';
        const hasEnding = isNaN(heightValue[heightValue.length - 1]) === true;
        
        if (hasEnding === false) {
            heightValue = heightValue + defaultEnding;
        }
        
        style['height'] = heightValue;
    }
    
    return style;
}