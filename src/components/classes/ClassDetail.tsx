import React from 'react';
import _ from 'lodash';

import {Paragraph, Text, LineBreak, Show, ListItem, Card, CardBody, CardHeader, UnorderedList} from '../SimpleComponents';

import HtmlService from './../../services/HtmlService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function ClassDetail({category, style, statName, width, height, stat, badgeRef, keys}: GamerClassDetailProps) {
    let gamerStatDisplayValue = parseFloat(stat.toString()).toFixed(2).toString();

    if (statName.includes('percent')) {
        gamerStatDisplayValue = gamerStatDisplayValue.toString() + '%';
    }

    let description = category['description'] || category['category'] || '';
    let statDisplayName = statName.split('_').map(_.capitalize).join(' ');

    let displayPercentiles = keys.map((val) => {
        let displayName = val.split('_').map(_.capitalize).join(' ');
        let percentile = category[val]['percentile'];
        let percentileVal = category[val]['value'];

        let displayValue = percentileVal.toFixed(2);
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
                </Text>, {'Better than ' + percentile.toFixed(2) * 100 as string + '% of players'}, {'>' + displayValue} {perMessage}
            </ListItem>
        );
    });

    const badgePosition = HtmlService.getElementPosition(badgeRef);

    const tooltipHeight = height;
    const tooltipWidth = width;


    return (
        <Card style={{
            position: 'fixed',
            top: (badgePosition.top - tooltipHeight) - 10 + 'px',
            left: badgePosition.leftRightMiddle - (tooltipWidth / 2) + 'px',
            zIndex: 123840,
            height: tooltipHeight + 'px',
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
    category?: object,
    stat?: number,
    style?: React.CSSProperties,
    badgeRef?: React.LegacyRef<HTMLDivElement>,
    statName?: string,
    height: number,
    width: number,
    keys?: string[]
}