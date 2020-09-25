import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Show = (props) => {
    return (
        <React.Fragment>
            {(props.show === true) ? props.children : undefined}
        </React.Fragment>
    );
};
export default Show;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Show.propTypes = {
    children: PropTypes.node,
    show: PropTypes.bool
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

