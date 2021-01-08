import React from 'react';

import Image from '../simple-components/Image';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export default function Loading(props: LoadingProps) {
    return (
        <Image className={'loading ' + props.className}
               style={props.style}
               src={'/assets/images/icons/spinner.png'}/>
    );
}



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

type LoadingProps = {
    style?: React.CSSProperties,
    className?: String
};