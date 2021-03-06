import {MatchID, RawMatch} from './../Matches/MatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export type GamerMatchID = string;



export type RawGamerMatch = RawMatch & {
    query_username: string,
    query_platform: string,
    match_id: MatchID,
    username: string,
    team: string,
    clan_tag: string,
    kills: number,
    assists: number,
    deaths: number,
    damage_taken: number,
    time_played: number,
    score: number,
    damage_done: number,
    team_placement: number,
    longest_streak: number,
    distance_traveled: number,
    team_survival_time: number,
    percent_time_moving: number,
    wall_bangs: number,
    gulag_deaths: number,
    gulag_kills: number,
    headshots: number,
    executions: number,
    objective: Record<any, unknown>,
    xp: Record<any, unknown>,
    platform_username: string
};


export type RawGamerMatchList = RawGamerMatch[];


export type GamerMatch = RawGamerMatch & RawMatch & Record<any, unknown>;


export type GamerMatchList = GamerMatch[];