import Head from 'next/head';
import Router from 'next/router';
import {withRouter} from 'next/router';

import React from 'react';
import {Box} from './../SimpleComponents';
import CSS from 'csstype';
import {UserService} from '../Users';
import AppService from '../../services/AppService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


class Page extends React.Component<PageProps, PageState> {

    constructor(props) {
        super(props);

        this.state = {
            show: (!this.props.loginRequired === true)
        };
    }


    componentDidMount() {
        if (this.props.loginRequired === true) {
            this._redirectIfUserIsNotLoggedIn();
        } else if (this.props.redirectIfLoggedIn === true) {
            this._redirectIfUserIsLoggedIn();
        }
    }


    render() {
        const props = this.props;
        const classNames = this._getClassNames(props);

        return (
            <Box style={props.style} className={classNames}>
                <Head>
                    <link rel="stylesheet"
                          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap"/>

                    <title>
                        {props.title}
                    </title>
                </Head>

                {this.state.show && props.children}
            </Box>
        );
    }



    _getClassNames(props) {
        const classNames = [
            'app-container'
        ];

        return classNames.join(' ');
    }



    _redirectIfUserIsNotLoggedIn() {
        if (UserService.userIsLoggedIn()) {
            if (UserService.currentSessionTokenHasBeenVerified()) {
                //user is okay to be here
                this.setState({
                    show: true
                });
            } else {
                UserService.verifyCurrentUserAndToken().then((response) => {
                    //user is okay to be here
                    this.setState({
                        show: true
                    });
                }, (error) => {
                    console.log('session token is invalid');
                    console.log(error);
                    UserService.logout();
                    Router.push('/');
                });
            }
        } else {
            UserService.logout();
            Router.push('/');
        }
    }



    _redirectIfUserIsLoggedIn() {
        if (AppService.isClientSide() && UserService.userIsLoggedIn() && UserService.userHasBeenRedirectedAlready() !== true) {
            Router.push('/dashboard');
            UserService.setUserHasBeenRedirected();
        }
    }
}


type PageProps = {
    className?: string | Array<string>,
    style?: CSS.Properties,
    children?: React.ReactNode,
    title?: string,
    loginRequired?: boolean,
    redirectIfLoggedIn?: boolean,
}


type PageState = {
    show: boolean
}


export default withRouter(Page);