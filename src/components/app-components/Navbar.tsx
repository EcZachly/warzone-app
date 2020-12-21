import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';

import {Box, Button, Show, Text} from './../SimpleComponents';
import {UserService} from '../Users';

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

        let userIsLoggedIn = UserService.userIsLoggedIn();

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
                        <a onClick={() => Router.push(userIsLoggedIn ? '/dashboard' : '/login')}>
                            {userIsLoggedIn ? 'Dashboard' : 'Log In'}
                        </a>

                        <Button type={'secondary'}
                                style={{fontWeight: 500}}
                                onClick={() => {
                                    if (userIsLoggedIn) {
                                        UserService.logout();
                                        Router.push('/?logout=true');
                                    } else {
                                        Router.push('/signup');
                                    }
                                }}>
                            {userIsLoggedIn ? 'Log Out' : 'Sign Up'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default withRouter(Navbar);