

export type Gamer = {
    aliases?: string[],
    kdr?: number
    max_kills?: number
    gulag_win_rate?: number,
    platform: string,
    username: string,
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
}