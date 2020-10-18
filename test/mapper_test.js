import {exampleData} from './etl/example_data';
import WarzoneMapper from '../src/lib/etl/mapper';
import chai from 'chai';
let expect = chai.expect;

describe('mapGamer', function() {
    it('should map columns correctly', function() {
        let mappedGamer = WarzoneMapper.mapGamer(exampleData.gamerData);
        // add an assertion
        expect(mappedGamer.username).to.equal(exampleData.gamerData.username);
        expect(mappedGamer.platform).to.equal(exampleData.gamerData.platform);
    });
});

describe('mapMatch', function() {
    it('should map columns correctly', function() {
        let mappedMatch = WarzoneMapper.mapMatch(exampleData.gamerMatchData);
        // add an assertion
        expect(mappedMatch.match_id).to.equal(exampleData.gamerMatchData.matchID);
        expect(mappedMatch.player_count).to.equal(exampleData.gamerMatchData.playerCount);
    });
});


describe('mapGamerMatch', function(){
    it('should map columns correctly', function() {
        let mappedGamerMatch = WarzoneMapper.mapGamerMatch(exampleData.gamerMatchData);
        // add an assertion
        expect(mappedGamerMatch.match_id).to.equal(exampleData.gamerMatchData.matchID);
        expect(mappedGamerMatch.username).to.equal(exampleData.gamerMatchData.player.username);
    });
});



