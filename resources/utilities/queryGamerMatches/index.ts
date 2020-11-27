import GamerMatchController from '../../../lib/components/GamerMatches/GamerMatchController';


function run() {
    GamerMatchController.queryGamerMatches({}, {limit: 1}).then((gamerMatches) => {
        console.log(gamerMatches);
    }).catch((error) => {
        console.log(error);
    });
}


run();