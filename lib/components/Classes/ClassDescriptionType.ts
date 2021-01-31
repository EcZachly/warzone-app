type ClassDescription = {
    category: string,
    description: string,
    percentiles: Record<any, unknown>
};

export type GamerClassDescription = {
    team_survival_cutoffs: ClassDescription,
    percent_time_moving_cutoffs: ClassDescription,
    distance_traveled_cutoffs: ClassDescription,
    down_enemy_circle_1_cutoffs: ClassDescription,
    looting_cutoffs: ClassDescription,
    missions_cutoffs: ClassDescription,
    team_wipe_cutoffs: ClassDescription,
    damage_taken_cutoffs: ClassDescription,
    headshots_cutoffs: ClassDescription,
    win_percentage_cutoffs: ClassDescription
};