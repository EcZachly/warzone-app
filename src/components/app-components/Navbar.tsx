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
                        <Show show={userIsLoggedIn !== true}>
                            <a href={'/login'} id={'login-button'}>
                                Log In
                            </a>

                            <a href={'/signup'} id={'signup-button'}>
                                <Button type={'secondary'} style={{fontWeight: 500}}>
                                    Sign Up
                                </Button>
                            </a>
                        </Show>


                        <Show show={userIsLoggedIn === true}>
                            <a href={'/dashboard'} id={'dashboard-button'} style={{marginRight: '15px'}}>
                                Dashboard
                            </a>

                            <Button type={'secondary'} id={'logout-button'} style={{fontWeight: 500}} onClick={() => {
                                UserService.logout();
                                Router.push('/?logout=true');
                            }}>
                                Log Out
                            </Button>
                        </Show>
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default withRouter(Navbar);