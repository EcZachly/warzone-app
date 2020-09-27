import React from "react";
import {Image} from "../SimpleComponents";

const CONFIG = {
    PRETTY_PLATFORM_MAP: {
        'xbl': 'Xbox Live',
        'psn': 'Playstation Network',
        'battle': 'Battle.net',
    }
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function GamerLink({gamer}) {
    const platformCode = gamer.platform;
    const platformPretty = getPrettyPlatform(platformCode);

    return (
        <Image style={{width: '20px', height: '20px', marginLeft: '10px'}}
               title={platformPretty}
               alt={'platform ' + platformPretty}
               src={"/images/platform/" + platformCode + ".png"}/>
    );
}


function getPrettyPlatform(platformCode) {
    return (CONFIG.PRETTY_PLATFORM_MAP[platformCode]) ? CONFIG.PRETTY_PLATFORM_MAP[platformCode] : platformCode
}