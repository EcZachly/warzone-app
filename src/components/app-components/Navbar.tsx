import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';

import {Box, Paragraph} from './../SimpleComponents';

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

        return (
            <Box id={'navbar'} className={'navbar'} style={props.style}>
                <Box id={'navbar-container'}>
                    <Box className={'navbar-items'} id={'navbar-left'}>
                        <a href={'/'} id={'brand-image'}>
                            Warzone
                        </a>
                    </Box>


                    <Box className={'navbar-items'} id={'navbar-right'}>
                        <a href={'/gamers'}>
                            Gamers
                        </a>
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default withRouter(Page);