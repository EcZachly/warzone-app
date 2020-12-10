const logger = require('tracer').colorConsole();

const express = require('express');

const Gamers = require('./directories/Gamers');
const Squads = require('./directories/Squads');

const MatchRoutes = require('./../lib/components/Matches/MatchRoutes');
const GamerMatchRoutes = require('./../lib/components/GamerMatches/GamerMatchRoutes');
const Users = require('./../lib/components/Users/UserRoutes');

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export function include(server) {
    let router = express.Router();

    router.post('/api/gamer', Gamers.createGamer)
    router.get('/api/gamer', Gamers.findGamers)
    router.get('/api/gamer/:platform/:username', Gamers.getGamerDetails);

    router.get('/api/squad', Squads.findSquads)

    router.get('/api/match', MatchRoutes.queryMatches)

    router.get('/api/gamer-match', GamerMatchRoutes.queryGamerMatches)

    router.get('/api/users', Users.createUser);

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