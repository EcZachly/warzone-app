import React, {useState} from "react";
import {Card, CardBody, CardHeader, Small} from "../SimpleComponents";
import {Gamer} from "./GamerTypes";
import {GamerLink} from "./index";
import {StatLabelValue} from "../SmartComponents";
import _ from 'lodash';

export default function GamerInfluenceCard({gamer, relationships}) {

    let helpingGamer = {
        username: relationships[0].helping_player,
        platform: relationships[0].helping_player_platform
    } as Gamer;
    let helpingPlayerLink = <GamerLink gamer={helpingGamer}/>

    let gamerLink = <GamerLink gamer={gamer}/>
    let stats = relationships.map((relationship) => {
        let statName = relationship['relationship_stat'].split('_').map(_.capitalize).join(' ')
        return <StatLabelValue style={{marginBottom: '0px'}} lowerIsBetter={relationship.lower_is_better} size={"sm"}
                               label={statName} statValue={relationship.stat_with_player}
                               compareStatLabel={"compared with overall " + statName}
                               compareStatValue={relationship.overall_stat}/>
    })


    let helperStats = relationships.map((relationship) => {
        let statName = relationship['relationship_stat'].split('_').map(_.capitalize).join(' ')
        return <StatLabelValue style={{marginBottom: '0px'}} lowerIsBetter={relationship.lower_is_better} size={"sm"}
                               label={statName} statValue={relationship.helper_stat_with_player}
                               compareStatLabel={"compared with overall " + statName}
                               compareStatValue={relationship.helper_overall_stat}/>
    })
    let playingWithComponent = <Small>while playing with</Small>
    return <Card>
        <CardBody>
            <div style={{float: 'left', width: '50%', marginBottom: '25px'}}>
                <h5>{gamerLink} {playingWithComponent} {helpingPlayerLink}</h5>
                {stats}
            </div>
            <div style={{float: 'left', width: '50%',  marginBottom: '25px'}}>
                <h5>{helpingPlayerLink} {playingWithComponent} {gamerLink}</h5>
                {helperStats}
            </div>
        </CardBody>
    </Card>
}

