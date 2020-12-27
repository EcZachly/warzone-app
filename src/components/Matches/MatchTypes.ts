//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


import {GamerMatchList} from '../gamer_match/GamerMatchTypes';

export type MatchID = string;



export type RawMatch = {
    match_id: MatchID,
    start_time: Date,
    end_time: Date,
    map: string,
    mode: string,
    duration: number,
    version: number,
    game_type: string,
    player_count: number,
    team_count: number,
    start_timestamp: Date,
    end_timestamp: Date,
    team_type: string,
    is_warzone_match: boolean
};


export type RawMatchList = RawMatch[];


export type Match = RawMatch & {
    gamers: GamerMatchList
};


export type MatchList = Match[];



