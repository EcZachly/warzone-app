//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export type GamerPlatform = 'xbl' | 'psn' | 'battle' | 'uno';


export type GamerUsername = string;


//GamerID is made up of the Gamer Platform and Gamer Username joined by a "-"
export type GamerID = GamerPlatform & '-' & GamerUsername;



export type RawGamer = {
    platform: GamerPlatform,
    username: GamerUsername,
    uno_id: number,
    needs_backfill?: boolean,
    aliases?: string[],
    kdr?: number
    max_kills?: number
    gulag_win_rate?: number,
    win_percentage?: number,
    total_kills?: number,
    avg_kills?: number,
    avg_deaths?: number,
    gamer_class_object?: Record<any, unknown>,
    distance_class?: string,
    movement_class?: string,
    mission_class?: string,
    looting_class?: string,
    aggressiveness_class?: string,
    team_wipe_class?: string,
    damage_taken_class?: string,
    survival_time_class?: string,
    headshots?: number,
    damage_taken?: number,
    mission?: number,
    movement?: number,
    looting?: number,
    team_wipe?: number,
    distance?: number,
    aggressiveness?: number,
    heat_rating?: number,
    overall_top_10_rate?: number,
    last_10_rolling_average_kdr?: number,
    last_30_rolling_average_kdr?: number,
    last_100_rolling_average_kdr?: number,
    last_10_rolling_average_kadr?: number,
    last_30_rolling_average_kadr?: number,
    last_100_rolling_average_kadr?: number,
    last_100_rolling_average_gulag_kdr?: number,

    last_100_solo_rolling_average_kdr?: number,
    solo_top_10_percent_match_count?: number,
    solo_top_10_percent_rate?: number,
    solo_top_10_rate?: number,
    solo_wins?: number,
    solo_win_rate?: number,
    solo_max_kills?: number,
    solo_match_count?: number,

    last_100_duo_rolling_average_kdr?: number,
    duo_top_10_percent_match_count?: number,
    duo_top_10_percent_rate?: number,
    duo_top_10_rate?: number,
    duo_wins?: number,
    duo_win_rate?: number,
    duo_max_kills?: number,
    duo_match_count?: number,

    last_100_trio_rolling_average_kdr?: number,
    trio_top_10_percent_match_count?: number,
    trio_top_10_percent_rate?: number,
    trio_top_10_rate?: number,
    trio_wins?: number,
    trio_win_rate?: number,
    trio_max_kills?: number,
    trio_match_count?: number,

    last_100_quad_rolling_average_kdr?: number,
    quad_top_10_percent_match_count?: number,
    quad_top_10_percent_rate?: number,
    quad_top_10_rate?: number,
    quad_wins?: number,
    quad_win_rate?: number,
    quad_max_kills?: number,
    quad_match_count?: number,


    classDescriptions?: Record<any, unknown>[],
    needs_update?: boolean
};


export type RawGamerList = RawGamer[];


export type Gamer = RawGamer & {
    pretty_gulag_win_rate?: string,
    gulag_kdr?: string,
    heat_score?: number,
    pretty_last_100_gulag_win_rate?: string,
    last_100_kadr_kdr_difference?: number,
    last_100_kadr_kdr_difference_percent?: string,
};


export type GamerList = Gamer[];

