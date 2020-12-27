import React from 'react';

import {Card, CardBody, CardFooter, CardHeader, CardImage, Link} from './../SimpleComponents';
import TypeService from './../../services/TypeService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const SmartCard = (props) => {
    const GeneratedCard = getCard(props);
    const isLink = !!props.href;
    
    
    if (isLink) {
        return (
            <Link href={props.href} notHref={true}>
                {GeneratedCard}
            </Link>
        );
    } else {
        return GeneratedCard;
    }
};
export default SmartCard;



function getCard(props) {
    const image = getImage(props);
    const header = getHeader(props);
    const footer = getFooter(props);
    const body = getBody(props);
    const imagePosition = getImagePosition(props);
    
    const isClickable = (!!props.href || TypeService.isFunction(props.onClick));
    
    let topImage, bottomImage;
    
    if (imagePosition === 'top' || imagePosition === 'both') {
        topImage = image;
    } else if (imagePosition === 'bottom') {
        bottomImage = image;
    }
    
    return (
        <Card className={'smart-card ' + props.className} onClick={props.onClick} style={props.style} isClickable={isClickable} shadow={props.shadow}>
            {header}
            {topImage}
            {body}
            {bottomImage}
            {footer}
        </Card>
    );
}



function getImagePosition(props) {
    const validPositions = [
        'top',
        'bottom'
    ];
    
    if (cardOnlyHasImage(props)) {
        return 'both';
    } else {
        return (validPositions.includes(props.position)) ? props.position : validPositions[0];
    }
    
}


function getHeader(props) {
    if (props.header) {
        return (
            <CardHeader style={props.headerStyle}>{props.header}</CardHeader>
        );
    } else {
        return '';
    }
}


function getFooter(props) {
    if (props.footer) {
        return (
            <CardFooter style={props.footerStyle}>{props.footer}</CardFooter>
        );
    } else {
        return '';
    }
}


function cardOnlyHasImage(props) {
    return (!props.footer && !props.header && !props.children && !!props.src);
}



function getImage(props) {
    const imagePosition = getImagePosition(props);
    
    const isAtVeryTop = !props.header && imagePosition === 'top';
    const isAtVeryBottom = !props.footer && imagePosition === 'bottom';
    const isOnlyElement = !props.header && !props.footer && !props.children;
    const hasNoPosition = isAtVeryTop === false && isAtVeryBottom === false && isOnlyElement === false;
    
    if (props.src) {
        return (
            <CardImage src={props.src}
                       style={props.iconStyle}
                       position={imagePosition}
                       noPosition={hasNoPosition}/>
        );
    } else if (props.iconSrc || props.icon) {
        throw Error('Not Yet implemented');
    } else {
        return '';
    }
}


function getBody(props) {
    if (props.children) {
        return (
            <CardBody style={props.bodyStyle}>
                {props.children}
            </CardBody>
        );
    } else {
        return '';
    }
}
