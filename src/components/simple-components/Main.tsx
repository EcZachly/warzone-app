import React from 'react';
import PropTypes from 'prop-types';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Main extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
    
        const classNames = this.getClassNames(props);
    
        return (
            <main className={classNames} style={props.style} ref={props.innerRef}>
                {props.children}
            </main>
        );
    }
    
    
    //===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
    //PRIVATE METHODS
    
    getClassNames(props) {
        let classNames = [
            'main'
        ];
        
        if (props.className) {
            classNames.push(props.className);
        }

        return classNames.join(' ');
    }
}


export default Main;
