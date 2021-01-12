import React, {useState} from 'react';


import {GamerAdd, GamerSearchInput, GamerService} from '../gamer';
import {Gamer} from '../gamer/GamerTypes';
import {GamerRelationshipService} from './index';

import {Box, LineBreak, Show} from './../SimpleComponents';
import {User, RawUser} from '../Users/UserTypes';
import {GamerRelationship} from './GamerRelationshipTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

type AddGamerFriendProps = {
    user: User | RawUser,
    onGamerAdd: (gamerRelationship: GamerRelationship) => void
};

export default function AddGamerFriend({user, onGamerAdd}: AddGamerFriendProps) {

    function newUserGamerSelect(gamer: Gamer) {
        if (gamer) {
            const {username, platform} = gamer;

            let userIsOkay = confirm(`select OK to make ${username} (${GamerService.getPlatformObjByID(platform).name}) your friend`);

            if (userIsOkay) {
                GamerRelationshipService.createGamerRelationship({
                    user_id: user.user_id,
                    username: username,
                    platform: platform,
                    type: 'friend'
                }).then((gamerRelationship) => {
                    if (onGamerAdd) {
                        onGamerAdd(gamerRelationship);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
    }

    return (
        <Box>
            <GamerSearchInput mode={'condensed'}
                              focus={false}
                              onGamerClick={newUserGamerSelect}/>

            <LineBreak style={{marginBottom: '40px', marginTop: '50px'}}/>

            <GamerAdd recaptchaSiteKey={process.env.NEXT_PUBLIC_WARZONE_RECAPTCHA_SITE_KEY}
                      onAdd={newUserGamerSelect}/>
        </Box>
    );
}