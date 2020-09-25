import React from 'react';
import PropTypes from 'prop-types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const Form = (props) => {
    const classNames = getClassNames(props);
    
    return (
        <form className={classNames}
              style={props.style}
              data-has-on-submit={!!props.onSubmit}
              onSubmit={(event) => {
                  event.preventDefault();
                  
                  if (props.onSubmit) {
                      props.onSubmit(props, event);
                  }
              }}>
            {props.children}
        </form>
    );
};
export default Form;


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PROPS

Form.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    
    //The function used to know when the form has been submitted, use this to enable the "enter" in input to submit the form
    onSubmit: PropTypes.func
};


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
//PRIVATE METHODS

function getClassNames(props) {
    let classNames = [
        ''
    ];
    
    if (props.className) {
        classNames.push(props.className);
    }
    
    return classNames.join(' ');
}