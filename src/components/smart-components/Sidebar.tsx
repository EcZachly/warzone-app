import React from 'react';

import {Container} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export default class Sidebar extends React.Component {
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const props = this.props;
        
        const classes = this._getClasses(props);
        
        return (
            <Container className={classes} {...props}>
                {props.children}
            </Container>
        );
    }
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PUBLIC METHODS
    
    
    
    //--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
    //PRIVATE METHODS
    
    _getClasses(props) {
        const classes = ['sidebar'];
        
        if (props.fixed === true) {
            classes.push('fixed');
        }
        
        if (props.card === true) {
            classes.push('card');
        }

        if (props.className) {
            classes.push(props.className);
        }
        
        return classes.join(' ');
    }
    
}