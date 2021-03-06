import React from 'react';

import {Box, Label, Link, Paragraph} from './../SimpleComponents';

import Placeholder from './Placeholder';

const CONSTANTS = {
    VALID_SIZES: ['sm']
};

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


type LabelValueProps = {
    className?: string,
    style?: React.CSSProperties,
    label: string | React.ReactNode,
    value: any | React.ReactNode,
    labelTitle?: string,
    valueTitle?: string,
    inline?: boolean,
    valueLoading?: boolean,
    size?: (typeof CONSTANTS.VALID_SIZES)[number]
}

const LabelValue = (props: LabelValueProps) => {
    
    const className = getClassName(props);
    const labelValue = getLabelValue(props);
    const valueContents = getValueContents(props);
    
    return (
        <Box className={className} style={props.style}>
            {labelValue}
            
            {valueContents}
        </Box>
    );
};
export default LabelValue;


function getClassName(props) {
    const classes = ['label-value-container'];
    
    if (props.size && CONSTANTS.VALID_SIZES.includes(props.size)) {
        classes.push('size-' + props.size);
    }

    if (props.inline === true) {
        classes.push('inline');
    }

    if (props.className) {
        classes.push(props.className);
    }
    
    return classes.join(' ');
}


function getValueContents(props) {
    const {valueLink, valueClick, value, valueLoading} = props;
    
    const valueIsClickable = !!(valueLink || valueClick);
    
    let valueClassName = 'value';
    
    if (valueIsClickable) {
        valueClassName = valueClassName + ' text-link';
    }
    
    if (valueLoading) {
        return (
            <Placeholder className={valueClassName} block style={props.valueStyle}/>
        );
    } else if (valueLink) {
        return (
            <Paragraph className={valueClassName} style={props.valueStyle}>
                <Link title={props.valueTitle} href={valueLink}>
                    {value}
                </Link>
            </Paragraph>
        );
    } else if (valueClick) {
        return (
            <Paragraph title={props.valueTitle} className={valueClassName} style={props.valueStyle} onClick={valueClick}>
                {value}
            </Paragraph>
        );
    // } else if (React.isValidElement(value)) {
    //     return value;
    } else {
        return (
            <Box className={valueClassName} style={props.valueStyle} onClick={valueClick}>
                {value}
            </Box>
        );
    }
}


function getLabelValue(props) {
    const {labelLink, labelClick, label} = props;
    
    const labelIsClickable = !!(labelLink || labelClick);
    
    let labelClassName = 'label';
    
    if (labelIsClickable) {
        labelClassName = labelClassName + ' text-link';
    }
    
    if (labelLink) {
        return (
            <Label title={props.labelTitle} className={labelClassName}>
                <Link href={labelLink}>
                    {label}
                </Link>
            </Label>
        );
    } else if (labelClick) {
        return (
            <Label title={props.labelTitle} className={labelClassName} onClick={labelClick}>
                {label}
            </Label>
        );
    } else {
        return (
            <Label title={props.labelTitle} className={labelClassName}>{label}</Label>
        );
    }
}