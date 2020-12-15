import React, {useState} from "react";
import GamerInfluenceCard from "./GamerInfluenceCard";
export default function GamerInfluenceList({gamer, viewData}) {

    let relationships = {}

    viewData.forEach((relationship)=>{
        let key = relationship['helping_player'] + '-' + relationship['helping_player_platform']
        if(!relationships[key]){
            relationships[key] = [relationship]
        }
        else{
            relationships[key].push(relationship)
        }
    })
    let vals = Object.keys(relationships).map((val)=> <GamerInfluenceCard gamer={gamer} relationships={relationships[val]}/> )

    return <div>{vals}</div>
}

