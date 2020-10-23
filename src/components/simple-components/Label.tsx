import React from 'react';
import PropTypes from 'prop-types';
import CSS from 'csstype';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Label = (props: LabelProps) => {
    const classNames = getClassNames(props);
    
    return (
        <label {...props} className={classNames} style={props.style} onClick={props.onClick} ref={props.innerRef}>
            {props.children}
        </label>
    );
};
export default Label;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type LabelProps = {
    className?: string,
    style?: CSS.Properties,
    onClick?: (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void,
    size?: string,
    innerRef?: any,
    children?: React.ReactNode
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = ['label'];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.size && getSize(props.size)) {
        classNames.push(getSize(props.size));
    }
    
    return classNames.join(' ');
}



function getSize(value) {
    const sizeMap = {
        'sm': 'small',
        'small': 'small',
        'lg': 'large',
        'large': 'large'
    };
    
    return (!!sizeMap[value]) ? sizeMap[value] : '';
}