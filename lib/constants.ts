export const MATCH_DETAILS_SLEEP_TIME = 2 * 1000;

export const TABLES = {
    GAMER_MATCHES: 'gamer_matches',
    USERS: 'users'
};

export const VIEWS = {
    MATCHES_AUGMENTED: 'matches_augmented',
    GAMER_MATCHES_AUGMENTED: '_gamer_matches_augmented',
    PLAYER_STAT_SUMMARY: 'player_stat_summary_materialized',
    GAMER_CLASS_DESCRIPTIONS: 'gamer_class_description_values',
    SQUAD_CLASS_DESCRIPTIONS: 'squad_class_description_values',
    GAMER_SITE_HITS: 'gamer_site_hits',
    GRADED_STATS: 'gamer_stats_graded',
    GRADING_TABLE: 'grading_table',
    TIME_ANALYSIS: 'time_analysis',
    TREND_ANALYSIS: 'trend_analysis',
    SQUADS: 'full_squad_stat_summary',
    TEAMMATES: 'teammate_analysis_materialized',
    GAMER_HEAT_RATINGS: 'gamer_heat_ratings',
    GAMER_ROLLING_TRENDS: 'gamer_rolling_trends',
    DAILY_PLAYER_STAT_SUMMARY: 'daily_player_stat_summary_materialized'
};

export const GAMER_TABLE = 'gamers';
export const ETL_JOBS = 'etl_jobs';
export const MATCH_TABLE = 'matches';
export const GAMER_MATCH_TABLE = 'gamer_matches';
export const MIN_MAX_TIMESTAMPS_VIEW = 'min_max_timestamps';
export const SITE_EVENTS = 'site_events';
export const DATABASE_SCHEMA = 'warzone';

export const MATERIALIZED_VIEWS_DEPENDENCIES: object = {
    [VIEWS.GRADING_TABLE]: [],
    [VIEWS.SQUADS]: [],
    [VIEWS.GAMER_ROLLING_TRENDS]: [],
    [VIEWS.GAMER_HEAT_RATINGS]: [VIEWS.GAMER_ROLLING_TRENDS],
    [VIEWS.SQUAD_CLASS_DESCRIPTIONS]: [],
    [VIEWS.GAMER_CLASS_DESCRIPTIONS]: [],
    [VIEWS.GAMER_SITE_HITS]: [],
    [VIEWS.PLAYER_STAT_SUMMARY]: [],
    [VIEWS.TEAMMATES]: [],
    [VIEWS.DAILY_PLAYER_STAT_SUMMARY]: []
}
