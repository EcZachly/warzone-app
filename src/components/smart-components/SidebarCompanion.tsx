import React from 'react';

import {Container} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const SidebarCompanion = (props) => {
    return (
        <Container className={'sidebar-companion ' + props.className} {...props}>
            {props.children}
        </Container>
    );
};
export default SidebarCompanion;