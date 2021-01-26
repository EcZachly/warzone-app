import tracer from 'tracer';
const logger = tracer.colorConsole();

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export function include(server: express.Application): void {
    const frontEndAccessFolder = '/assets';
    const pathToAssets = path.join(__dirname, '..', '..', 'src', 'assets');

    const options = {
        // maxage: (dev) ? '0' : '30d'
    };

    // server.use(favicon(path.join(__dirname, '..', '..', 'src', 'assets', 'images', 'favicon.ico')));
    server.use(frontEndAccessFolder, express.static(pathToAssets, options));
}



export default {
    include
};