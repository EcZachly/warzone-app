import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {

    }


    render() {
        const props = this.props;
        const backgroundColor = this._getBackgroundColor(props);
        const classNames = this._getClassNames(props);

        return (
            <div style={props.style} className={classNames}>
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet"/>

                    <title>{props.title}</title>
                </Head>

                {props.children}
            </div>
        );
    }


    _getBackgroundColor(props) {
        const defaultBackgroundColor = 'inherit';

        return (props.backgroundColor) ? props.backgroundColor : defaultBackgroundColor;
    }


    _getClassNames(props) {
        let classNames = [
            'app-container'
        ];

        return classNames.join(' ');
    }


}

export default withRouter(Page);