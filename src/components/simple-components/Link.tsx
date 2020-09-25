import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const PageLink = (props) => {
    const classNames = getClassNames(props);
    
    if (props.notHref) {
        return (
            <span onClick={() => linkClicked(props.href)} className={classNames} data-has-on-click={!!props.href}>
                {props.children}
            </span>
        );
    } else {
        return (
            <a className={classNames}
               style={props.style}
               title={props.title}
               name={props.name || ''}
               onClick={() => linkClicked(props.href)}>
                {props.children}
            </a>
        );
    }
};
export default PageLink;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PUBLIC METHODS

function linkClicked(href) {
    if (TypeService.isFunction(href)) {
        href();
    } else if (TypeService.isString(href)) {
        throw new Error('href is now required to be a function instead of a url');
    }
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

PageLink.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    href: PropTypes.func,
    
    //Instead of using an "a" tag, this will use a span with a onClick to change the page
    notHref: PropTypes.bool,
    
    textCenter: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        'link'
    ];
    
    if (props.textCenter === true) {
        classNames.push('display-block text-center');
    }
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    if (props.notHref) {
        classNames.push('no-href');
    } else {
        classNames.push('clickable');
    }
    
    return classNames.join(' ');
}