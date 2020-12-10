import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';

import {Box, Button, Text} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Navbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {

    }


    render() {
        const props = this.props;

        return (
            <Box id={'navbar'} className={'navbar'} style={props['style']}>
                <Box id={'navbar-container'}>
                    <Box className={'navbar-items'} id={'navbar-left'}>
                        <a href={'/'} id={'brand-image'}>
                            Warzone <Text>Stats Tracker</Text>
                        </a>

                        <a href={'/gamers'}>
                            Gamers
                        </a>

                        <a href={'/help'}>
                            Resources
                        </a>
                    </Box>


                    <Box className={'navbar-items'} id={'navbar-right'}>
                        <a>
                            Log In
                        </a>

                        <a href={'/signup'}>
                            <Button type={['dark']} style={{fontWeight: 500}}>
                                Sign Up
                            </Button>
                        </a>
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default withRouter(Navbar);