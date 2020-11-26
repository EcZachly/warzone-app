

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export type GamerPlatform = 'xbl' | 'psn' | 'battle';


export type GamerUsername = string;


//GamerID is made up of the Gamer Platform and Gamer Username joined by a "-"
export type GamerID = GamerPlatform & '-' & GamerUsername;



export type RawGamer = {
    platform: GamerPlatform,
    username: GamerUsername,
    aliases?: string[],
    kdr?: number
    max_kills?: number
    gulag_win_rate?: number,
    win_percentage?:number,
    total_kills?:number,
    avg_kills?:number,
    gamer_class_object?: object,
    distance_class?: string,
    movement_class?: string,
    mission_class?: string,
    looting_class?: string,
    aggressiveness_class?: string,
    team_wipe_class?: string,
    damage_taken_class?: string,
    survival_time_class?: string,
    headshots?:number,
    damage_taken?:number,
    mission?: number,
    movement?:number,
    looting?:number,
    team_wipe?:number,
    distance?:number,
    aggressiveness?:number,
    heat_rating?: number,
    last_10_rolling_average_kdr?: number,
    last_30_rolling_average_kdr?: number,
    last_100_rolling_average_kdr?: number
};


export type RawGamerList = RawGamer[];


export type Gamer = RawGamer & {

};


export type GamerList = Gamer[];

