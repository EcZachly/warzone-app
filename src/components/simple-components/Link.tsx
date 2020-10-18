import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const PageLink = (props: PageLinkProps) => {
    const classNames = getClassNames(props);

    if (props.notHref) {
        return (
            <span onClick={() => linkClicked(props)}
                  title={props.title}
                  className={classNames}
                  data-has-on-click={!!props.href || !!props.onClick}>
                {props.children}
            </span>
        );
    } else {
        return (
            <a className={classNames}
               style={props.style}
               title={props.title}
               onClick={() => linkClicked(props)}>
                {props.children}
            </a>
        );
    }
};
export default PageLink;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PUBLIC METHODS

function linkClicked(props) {
    const {href, onClick} = props;

    if (typeof href === 'string') {
        throw new Error('href is now required to be a function instead of a url');
    } else if (href) {
        href();
    } else if (onClick) {
        onClick();
    }
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type PageLinkProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode | React.ReactNodeArray,
    href?:  () => void,
    onClick?:  () => void,
    notHref?: boolean,
    textCenter?: boolean,
    title?: string
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    const classNames = [
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