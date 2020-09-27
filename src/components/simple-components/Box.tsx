import React from 'react';
import PropTypes from 'prop-types';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Box extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
    
        const classNames = this.getClassNames(props);
    
        return (
            <div id={props.id} className={classNames} style={props.style} title={props.title} ref={props.innerRef}>
                {props.children}
            </div>
        );
    }
    
    
    //===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
    //PRIVATE METHODS
    
    getClassNames(props) {
        let classNames = [
            'box'
        ];
        
        if (props.className) {
            classNames.push(props.className);
        }
        
        if (props.shadow === true) {
            classNames.push('box-shadow');
        } else if (Number.isInteger(props.shadow) && props.shadow > 0 && props.shadow <= 5) {
            classNames.push('box-shadow-' + props.shadow);
        }
        
        return classNames.join(' ');
    }
}


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Box.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //If true, it will add a standard box-shadow, or a value between 1 and 5 will change the depth (1 being shallow, and 5 being the deepest)
    shadow: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([1, 2, 3, 4, 5])]),
    
    title: PropTypes.string
};

const ForwardedRefBox = React.forwardRef((props, ref) => <Box innerRef={ref} {...props}/>);
ForwardedRefBox.propTypes = Box.propTypes;

export default ForwardedRefBox;
