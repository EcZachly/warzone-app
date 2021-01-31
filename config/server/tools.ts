import express from 'express';
import cookieParser from 'cookie-parser';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export function configure(server: express.Application): void {
    server.use(cookieParser());
}



export default {
    configure
};