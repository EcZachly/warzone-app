

export type Gamer = {
    aliases?: string[],
    kdr?: number
    max_kills?: number
    gulag_win_rate?: number,
    win_percentage?:number,
    total_kills?:number,
    avg_kills?:number,
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
    aggressiveness?:number
}