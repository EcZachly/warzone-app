const express = require('express');
const path = require('path');

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


/**
 *
 * @param server
 * @param app
 * @param {Object} [options]
 */
export function include(server, app, options) {
    server.get('/gamers', (req, res) => {
        const actualPage = '/gamers/index';
        const queryParameters = req.params;
        app.render(req, res, actualPage, queryParameters);
    });

    // server.get('/dashboard', (req, res) => {
    //     const actualPage = '/dashboard';
    //     const queryParameters = req.params;
    //     app.render(req, res, actualPage, queryParameters);
    // });
    //
    // server.get('/contracts', (req, res) => {
    //     const actualPage = '/contracts';
    //     const queryParameters = req.params;
    //     app.render(req, res, actualPage, queryParameters);
    // });
}



export default {
    include
};