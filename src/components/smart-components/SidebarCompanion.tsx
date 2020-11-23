import React from 'react';

import {Container} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const SidebarCompanion = (props) => {
    return (
        <Container className={'sidebar-companion ' + props.className} ref={props.innerRef} {...props}>
            {props.children}
        </Container>
    );
};
export default SidebarCompanion;