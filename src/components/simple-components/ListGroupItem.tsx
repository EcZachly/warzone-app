import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';
import Badge from './Badge';
import Button from './Button';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const ListGroup = (props) => {
    const classNames = getClassNames(props);
    const badge = getBadge(props);
    const style = getStyle(props);
    const Tag = getTag(props);
    
    return (
        <Tag {...props}
             className={classNames}
             style={{...style, ...props.style}}
             noDefaultType={isClickable(props) && overrideDefaultType(props) === false}>
            
            {props.children}
            
            {badge}
        
        </Tag>
    );
};
export default ListGroup;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

ListGroup.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    onClick: PropTypes.func,
    
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    
    badgeType: Badge.propTypes.type,
    
    badgeColor: Badge.propTypes.color
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getTag(props) {
    return (isClickable(props)) ? Button : ListItem;
}


function overrideDefaultType(props) {
    return (!!props.type || !!props.color);
}



function getClassNames(props) {
    let classNames = [
        'list-group-item'
    ];
    
    if (isClickable(props)) {
        classNames.push('list-group-item-action');
    }
    
    if (props.active === true) {
        classNames.push('active');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}


function isClickable(props) {
    return TypeService.isFunction(props.onClick);
}


function getStyle(props) {
    let style = {};
    
    if (badgeValueExists(props)) {
        style.display = 'flex';
        style.justifyContent = 'space-between';
        style.alignItems = 'center';
    }
    
    return style;
}



function badgeValueExists(props) {
    return (TypeService.isNumeric(props.badge) || TypeService.isString(props.badge, true));
}


function getBadge(props) {
    if (badgeValueExists(props)) {
        return (
            <Badge type={props.badgeType} color={props.badgeColor}>{props.badge}</Badge>
        );
    } else {
        return '';
    }
}