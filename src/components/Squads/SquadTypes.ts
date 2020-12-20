import {GamerID} from '../gamer/GamerTypes';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//




//Squad ID is made up of GamerIDs joined by a "+"
export type SquadID = string;



export type SquadType = 'duo' | 'trio' | 'quad';


export type RawSquad = {
    team_grain: SquadID,
    team_type: SquadType,
    gamers: GamerID[],
    num_matches: number,
    total_kills: number,
    total_deaths: number,
    kdr: number,
    kills_per_game: number,
    kills_per_person_per_game: number,
    score_per_game: number,
    score_per_person_per_game: number,
    total_teams_wiped: number,
    teams_wiped: number,
    down_enemy_circle_1: number,
    missions_started: number,
    total_caches_opened: number,
    caches_opened: number,
    damage_taken: number,
    team_survival_time_mins: number,
    avg_placement: number,
    win_percentage: number,
    total_wins: number,
    percent_time_moving: number,
    distance_traveled: number,
    total_headshots: number,
    headshots: number,
    gulag_win_rate: number,
    game_category: String
};


export type RawSquadList = RawSquad[];


export type Squad = RawSquad & {
    pretty_gulag_win_rate: string
};


export type SquadList = Squad[];



