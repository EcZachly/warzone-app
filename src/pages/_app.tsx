import React from 'react';
import App from 'next/app';

import './../assets/styles/config.scss';
import './../assets/styles/components.scss';

import './../assets/styles/appComponents.scss';
import './../assets/styles/appStyles.scss';

export default class CustomApp extends App {
    // Only uncomment this method if you have blocking data requirements for
    // every single page in your application. This disables the ability to
    // perform automatic static optimization, causing every page in your app to
    // be server-side rendered.
    //
    // static async getInitialProps(appContext) {
    //   // calls page's `getInitialProps` and fills `appProps.pageProps`
    //   const appProps = await App.getInitialProps(appContext);
    //
    //   return { ...appProps }
    // }

    render() {
        const {Component, pageProps} = this.props;
        return (
            <Component {...pageProps} />
        );
    }
}