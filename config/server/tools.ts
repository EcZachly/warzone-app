const logger = require('tracer').colorConsole();

const express = require('express');
const cookieParser = require('cookie-parser');

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

/**
 *
 * @param server
 * @param {Object} [options]
 */
export function configure(server, options) {
    server.use(cookieParser());
}



export default {
    configure
}