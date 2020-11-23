import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import {Table, TableBody, TableHead, TableRow, TableData, TableHeader} from '../SimpleComponents';
import {GamerLink} from '../AppComponents';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export default function TeammateTable({teammates}) {
    const tableHeaders = generateTableHeaders(teammates);
    const rows = generateTableRows(teammates);


    return (
        <div style={{overflow: 'auto'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        {tableHeaders}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </div>
    );
}



function generateTableRows(teammates) {
    return teammates.map((teammate, teammateIndex) => {

        const tableData = Object.keys(teammate).map(function (key, index) {
            let content;

            if (key.includes('time')) {
                content = moment(teammate[key]).format('MM/DD/YYYY');
            } else if (key.includes('player')) {
                if (!['(overall)', 'without teammates'].includes(teammate[key].name)) {
                    content = (
                        <GamerLink gamer={{username: teammate[key].name, platform: teammate[key].platform}}/>
                    );
                } else {
                    content = teammate[key].name;
                }
            } else if (key.includes('avg') || key.includes('kdr')) {
                content = Number.isNaN(parseFloat(teammate[key])) ? '-' : parseFloat(teammate[key]).toFixed(2);
            } else {
                content = teammate[key];
            }

            return (
                <TableData key={teammateIndex + key}>
                    {content}
                </TableData>
            );
        });

        return (
            <TableRow key={teammate.helping_player.name + ' ' + teammateIndex}>
                {tableData}
            </TableRow>
        );
    });
}



function generateTableHeaders(teammates) {
    return Object.keys(teammates[0])
        .map((key) => key.split('_').map(_.capitalize).join(' '))
        .map((key) => <TableHeader verticalAlign={'middle'} key={key}>{key}</TableHeader>);
}