import tracer from 'tracer';
const logger = tracer.colorConsole();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

/**
 *
 * @param server
 * @param {Object} [options]
 */
export function include(server, options) {
    const frontEndAccessFolder = '/assets';
    const pathToAssets = path.join(__dirname, '..', '..', 'src', 'assets');

    options = {
        // maxage: (dev) ? '0' : '30d'
    };

    // server.use(favicon(path.join(__dirname, '..', '..', 'src', 'assets', 'images', 'favicon.ico')));
    server.use(frontEndAccessFolder, express.static(pathToAssets, options));
}



export default {
    include
};