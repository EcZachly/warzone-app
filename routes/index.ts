const logger = require('tracer').colorConsole();

const express = require('express');

const Gamers = require('./directories/Gamers');
const Squads = require('./directories/Squads');

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export function include(server) {
    let router = express.Router();

    router.post('/api/gamer', Gamers.createGamer)
    router.get('/api/gamer', Gamers.findGamers)

    router.get('/api/gamer/:platform/:username', Gamers.getGamerDetails);

    router.get('/api/sqaud', Squads.findSquads)

    configure(server);
    server.use('/', router);
}



function configure(server) {
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
}


export default {
    include
};