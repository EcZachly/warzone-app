import React from 'react';
import CSS from "csstype";

import {Media, MediaBody, MediaImage} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const MediaItem = (props: MediaItemProps) => {
    return (
        <Media className={props.className} style={props.style} border={props.border} borderBottom={props.borderBottom}>
            <MediaImage src={props.src} position={props.position}/>
            
            <MediaBody>
                {props.children}
            </MediaBody>
        </Media>
    );
};

type MediaItemProps = {
    src: string,
    position: string,
    className: string,
    children: React.ReactNode,
    style: CSS.Properties,
    border: any,
    borderBottom: any
}
export default MediaItem;