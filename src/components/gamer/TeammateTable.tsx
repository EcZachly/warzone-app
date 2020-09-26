import React from 'react';
import {Table, TableBody, TableRow, TableData, TableHeader} from '../SimpleComponents';
import _ from 'lodash'
export default function TeammateTable({teammates, filterKeys}) {
    let tableHeaders = Object.keys(teammates[0])
                        .filter((key) => !filterKeys.includes(key))
                        .map((key)=> key.split('_').map(_.capitalize).join(' '))
                        .map((key)=> <TableHeader>{key}</TableHeader>)


    let rows = teammates.map((teammate, teammateIndex)=>{
        let tableData = Object.keys(teammate).filter((key) => !filterKeys.includes(key)).map(function(key, index){

            if(key.includes("time")){
                return <TableData key={teammateIndex + key}>{new Date(teammate[key]).toDateString()}</TableData>
            }
            else if(key.includes('player')){
                if (!["(overall)", "without teammates"].includes(teammate[key].name)){
                    return <TableData key={teammateIndex + key}>
                        <a href={"/gamer/" + teammate[key].platform + "/" + encodeURIComponent(teammate[key].name)}>{teammate[key].name}</a></TableData>
                }
                else{
                    return <TableData key={teammateIndex + key}>{teammate[key].name}</TableData>
                }
            }
            else if(key.includes("avg") || key.includes("kdr")){
                let displayVal = Number.isNaN(parseFloat(teammate[key])) ? "-" : parseFloat(teammate[key]).toFixed(2);
                return <TableData key={teammateIndex + key}>{displayVal}</TableData>
            }
            else{
                return <TableData key={teammateIndex + key}>{teammate[key]}</TableData>
            }
        })
        return <TableRow key={teammate.helping_player.name + " " + teammateIndex}>{tableData}</TableRow>
    })


    return (
        <div style={{overflow: 'auto'}}>
        <Table>
            {tableHeaders}

            <TableBody>
                {rows}
            </TableBody>
        </Table>
        </div>


    )


}