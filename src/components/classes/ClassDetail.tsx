import React from 'react';
import _ from 'lodash';

import {
    Card,
    CardBody,
    CardHeader,
    LineBreak,
    ListItem,
    Paragraph,
    Show,
    Text,
    UnorderedList
} from '../SimpleComponents';

import HtmlService from './../../services/HtmlService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function ClassDetail({
                                        category,
                                        style,
                                        statName,
                                        width,
                                        height,
                                        stat,
                                        badgeRef,
                                        keys,
                                        tiered = false
                                    }: GamerClassDetailProps) {
    let gamerStatDisplayValue = parseFloat(stat.toString()).toFixed(2).toString();

    if (statName.includes('percent')) {
        gamerStatDisplayValue = gamerStatDisplayValue.toString() + '%';
    }

    const description = category['description'] || category['category'] || '';
    const statDisplayName = statName.split('_').map(_.capitalize).join(' ');

    const displayPercentiles = keys.filter((key)=> {
        return !tiered || key.includes('1') || key.includes('legend') || key.includes('master');
    }).map((val) => {
        const displayName = val.split('_').map(_.capitalize).join(' ');
        const percentile = category[val]['percentile'];
        const percentileVal = category[val]['value'];

        let displayValue = parseFloat(percentileVal.toString()).toFixed(2);
        let perMessage = ' per game';

        if (statName.includes('percent')) {
            displayValue = percentileVal.toFixed(2) + '%';
            perMessage = '';
        }

        if (statName.includes('mins')) {
            displayValue = percentileVal.toFixed(2) + ' minutes';
        }

        return (
            <ListItem key={displayName} style={{fontSize: '.9em', lineHeight: '125%'}}>
                <Text style={{fontWeight: 'bold'}}>
                    {displayName}
                </Text>, {'Better than ' + (percentile * 100).toFixed(0) as string + '% of players'}, {'>' + displayValue} {perMessage}
            </ListItem>
        );
    });

    const badgePosition = HtmlService.getElementPosition(badgeRef);
    const windowDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollY: window.scrollY
    };

    const tooltipHeight = height;
    let tooltipWidth = width;
    let tooltipLeft = badgePosition.leftRightMiddle - (tooltipWidth / 2);
    let tooltipTop = (badgePosition.top - tooltipHeight) - 10;

    if (tooltipWidth > windowDimensions.width) {
        tooltipWidth = windowDimensions.width * .95;
    }

    if (tooltipLeft < 0) {
        tooltipLeft = 0;
    }

    if (tooltipTop < 0) {
        tooltipTop = 10;
    }

    return (
        <Card style={{
            position: 'fixed',
            top: tooltipTop + 'px',
            left: tooltipLeft + 'px',
            zIndex: 123840,
            minHeight: tooltipHeight + 'px',
            width: tooltipWidth + 'px',
            ...style
        }}>
            <CardHeader>
                <Paragraph>
                    <Text>
                        This class is based on the stat: <Text bold>{statDisplayName}</Text>
                    </Text>
                    <LineBreak clear/>
                    <Text>
                        Average: <Text bold>{gamerStatDisplayValue}</Text>
                    </Text>
                </Paragraph>
            </CardHeader>
            <CardBody>
                <Show show={!!description}>
                    <Paragraph type={'help'}>{description}</Paragraph>
                </Show>
                <UnorderedList>
                    {displayPercentiles}
                </UnorderedList>
            </CardBody>
        </Card>
    );
}

type GamerClassDetailProps = {
    category?: Record<any, unknown>,
    stat?: number,
    style?: React.CSSProperties,
    badgeRef?: React.LegacyRef<HTMLDivElement>,
    statName?: string,
    height: number,
    width: number,
    keys?: string[],
    tiered?: boolean
}