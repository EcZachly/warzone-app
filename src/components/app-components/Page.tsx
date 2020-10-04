import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';
import {Box} from './../SimpleComponents';
import CSS from "csstype";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Page extends React.Component<PageProps> {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {

    }


    render() {
        const props = this.props;
        const classNames = this._getClassNames(props);

        return (
            <Box style={props.style} className={classNames}>
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet"/>

                    <title>{props.title}</title>
                </Head>

                {props.children}
            </Box>
        );
    }



    _getClassNames(props) {
        let classNames = [
            'app-container'
        ];

        return classNames.join(' ');
    }
}


type PageProps = {
    className?: string | Array<String>,
    style?: CSS.Properties,
    children?: React.ReactNode,
    title?: string,
}


export default withRouter(Page);