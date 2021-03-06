import tracer from 'tracer';
const logger = tracer.colorConsole();

import express from 'express';
import DefaultMiddleware from './defaultMiddleware';

import Gamers from './directories/Gamers';
import Squads from './directories/Squads';

import MatchRoutes from './../lib/components/Matches/MatchRoutes';
import GamerMatchRoutes from './../lib/components/GamerMatches/GamerMatchRoutes';
import GamerRelationshipRoutes from './directories/GamerRelationshipRoutes';
import Users from './directories/UserRoutes';
import Resources from './directories/Resources';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export function include(server) {
    const router = express.Router();

    router.post('/api/login', Users.login);
    router.post('/api/forgot-password', Users.sendForgotPassword);
    router.put('/api/forgot-password', Users.finishForgotPassword);
    router.get('/api/confirm-user', Users.finishConfirmAccount);
    router.get('/api/resources', Resources.findResources);
    router.post('/api/v1/verify-user-token', Users.verifyUserToken);


    router.post('/api/gamer', Gamers.createGamer);
    router.get('/api/gamer', Gamers.findGamers);
    router.get('/api/gamer/:platform/:username', DefaultMiddleware, Gamers.getGamerDetails);

    router.get('/api/squad', Squads.findSquads);

    router.get('/api/match', MatchRoutes.queryMatches);

    router.get('/api/gamer-match', GamerMatchRoutes.queryGamerMatches);

    router.get('/api/v1/gamer-relationship', GamerRelationshipRoutes.queryGamerRelationships);
    router.post('/api/v1/gamer-relationship', GamerRelationshipRoutes.createGamerRelationship);
    router.delete('/api/v1/gamer-relationship', GamerRelationshipRoutes.removeGamerRelationship);

    router.get('/api/users', Users.queryUsers);
    router.post('/api/users', Users.createUser);


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