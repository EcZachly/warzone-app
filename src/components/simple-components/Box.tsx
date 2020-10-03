import React from 'react';
import CSS from "csstype";


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Box extends React.Component<BoxProps> {
    
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

type BoxProps = {
    className?: string | Array<String>,
    style?: CSS.Properties,
    children?: React.ReactNode,
    shadow?: Boolean | 1 | 2 | 3 | 4 | 5,
    title?: string,
    id?: string,
    ref?: any,
    innerRef?: any
}

const ForwardedRefBox = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => <Box innerRef={ref} {...props}/>);

export default ForwardedRefBox;
