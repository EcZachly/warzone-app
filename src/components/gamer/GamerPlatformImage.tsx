import React from "react";

import GamerService from './GamerService';
import {Image} from "../SimpleComponents";
import CSS from "csstype";

const CONFIG = {
    PRETTY_PLATFORM_MAP: {
        'xbl': 'Xbox Live',
        'psn': 'Playstation Network',
        'battle': 'Battle.net',
    }
}

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function GamerPlatformImage({gamer, size, color}: GamerPlatformImageProps) {
    const platformCode = gamer['platform'];
    const platformConfig = GamerService.getPlatformObjByID(platformCode);


    const platformPretty = platformConfig.name;
    const platformImageName = platformConfig.image;
    const selectedSize = getSize(size);
    const selectedColor = ['black', 'white'].includes(color) ? color : 'white';

    const url = '/images/platform/' + [platformImageName, selectedColor, selectedSize].join('-') + '.png';

    return (
        <Image style={{width: '20px', height: '20px', marginLeft: '10px'}}
               title={platformPretty}
               alt={'platform ' + platformPretty}
               src={url}/>
    );
}


type GamerPlatformImageProps = {
    gamer: Object,
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    color?: 'black' | 'white'
}


function getSize(size) {
    const sizeMap = {
        xs: 'xs',
        'extra-small': 'xs',
        sm: 'sm',
        small: 'sm',
        md: 'md',
        medium: 'md',
        lg: 'lg',
        large: 'lg'
    };

    return sizeMap[size] ? sizeMap[size] : sizeMap['sm']
}