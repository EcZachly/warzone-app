import React, {useState} from "react";
import Card from "../simple-components/Card";
import {CardHeader, Small} from "../SimpleComponents";
import {Gamer} from "./GamerTypes";
import {GamerLink} from "./index";


export default function GamerInfluenceCard({gamer, relationships}) {

    let helpingGamer = {
        username: relationships[0].helping_player,
        platform: relationships[0].helping_player_platform
    } as Gamer;
    let helpingPlayerLink = <GamerLink gamer={helpingGamer}/>
    let subtitle = <Small> {"improves " + relationships.length + " stats"}</Small>
    return <Card><CardHeader>{helpingPlayerLink} {subtitle}</CardHeader></Card>
}

