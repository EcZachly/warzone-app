import {GamerSearchInput, GamerService} from "../gamer";
import React from "react";
import {GamerRelationshipService} from "./index";


export default function CreateGamerRelationship({user}) {
    function newUserGamerSelect(gamer) {
        if (gamer) {
            const {username, platform} = gamer;

            let userIsOkay = confirm(`select OK to make ${username} (${GamerService.getPlatformObjByID(platform).name}) your friend`);

            if (userIsOkay) {
                return GamerRelationshipService.createGamerRelationship({
                    user_id: user.data.user_id,
                    username: username,
                    platform: platform,
                    type: 'friend'
                });
            }
        }
    }

    return (
        <div>
            <GamerSearchInput size={"sm"} mode={'condensed'} focus={false} onGamerClick={newUserGamerSelect}/>
        </div>
    )
}