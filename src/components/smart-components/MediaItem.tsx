import React from 'react';

import {Media, MediaBody, MediaImage} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const MediaItem = (props) => {
    return (
        <Media className={props.className} style={props.style} border={props.border} borderBottom={props.borderBottom}>
            <MediaImage src={props.src} position={props.position}/>
            
            <MediaBody>
                {props.children}
            </MediaBody>
        </Media>
    );
};
export default MediaItem;