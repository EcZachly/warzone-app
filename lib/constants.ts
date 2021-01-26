export const MATCH_DETAILS_SLEEP_TIME = 3 * 1000;


export const DATABASE_SCHEMA = 'warzone';

export const TABLES = {
    GAMER_MATCHES: 'gamer_matches',
    MATCHES: 'matches',
    GAMERS: 'gamers',
    USERS: 'users',
    RESOURCES: 'resources',
    SITE_EVENTS: 'site_events',
    GAMER_RELATIONSHIPS: 'gamer_relationships',
    ETL_JOBS: 'etl_jobs'
};

export const VIEWS = {
    MATCHES_TO_AUGMENT: 'matches_to_augment',
    FOLLOW_GAMERS: 'followed_gamers',
    GAMER_MATCHES_AUGMENTED: '_gamer_matches_augmented',
    GAMER_STAT_SUMMARY: 'gamer_stat_summary_materialized',
    GAMER_CLASS_DESCRIPTIONS: 'gamer_class_description_values',
    SQUAD_CLASS_DESCRIPTIONS: 'squad_class_description_values',
    GAMER_SITE_HITS: 'gamer_site_hits',
    GRADED_STATS: 'gamer_stats_graded_materialized',
    GRADING_TABLE: 'grading_table',
    TIME_ANALYSIS: 'time_analysis',
    TREND_ANALYSIS: 'trend_analysis',
    SQUADS: 'squad_stat_summary_materialized',
    GAMER_ROLLING_TRENDS: 'gamer_rolling_trends_materialized',
    DAILY_PLAYER_STAT_SUMMARY: 'daily_player_stat_summary_materialized',
    GAMER_INFLUENCE_RELATIONSHIPS: 'gamer_influence_relationships_materialized',
    MIN_MAX_TIMESTAMPS_VIEW: 'min_max_timestamps'
};

export const GAME_CATEGORIES = {
    WARZONE: 'Warzone',
    JUGGERNAUT_ROYALE: 'Juggernaut Royale',
    MINI_ROYALE: 'Mini Royale',
    RESURGENCE: 'Resurgence',
    WARZONE_RUMBLE: 'Warzone Rumble',
    STIMULUS: 'Buy Back',
    TRUCK_WAR: 'Truck War',
    ZOMBIE_ROYALE: 'Zombie Royale',
    KING_SLAYER: 'King Slayer',
    PLUNDER: 'Plunder',
    DMZ: 'DMZ',
    REBIRTH_MINI_ROYALE: 'Rebirth Mini Royale'
};

export const BASE_TITLE = 'Warzone Stats Tracker';
export const SENDER_EMAIL = 'warzone@brshooter.com';