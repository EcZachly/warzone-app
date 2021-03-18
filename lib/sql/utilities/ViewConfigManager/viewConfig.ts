export type ViewConfigObject = {
    name: string,
    type: 'table' | 'view',
    group?: 'core' | 'detail' | 'etl',
    materialized: boolean,
    position?: number,
    path?: string,
    fullPath?: string,
    rawSQL?: string,
};

export type ViewConfigList = ViewConfigObject[];

export default [
    {
        name: 'etl_jobs',
        type: 'table'
    },
    {
        name: 'gamer_matches',
        type: 'table'
    },
    {
        name: 'gamer_relationships',
        type: 'table'
    },
    {
        name: 'gamers',
        type: 'table'
    },
    {
        name: 'matches',
        type: 'table'
    },
    {
        name: 'materialized_view_refresh',
        type: 'table'
    },
    {
        name: 'resources',
        type: 'table'
    },
    {
        name: 'site_events',
        type: 'table'
    },
    {
        name: 'users',
        type: 'table'
    },
    {
        name: 'users',
        type: 'table'
    },
    {
        name: 'gamer_rolling_trends',
        type: 'view',
        group: 'core'
    },
    {
        name: 'gamer_stat_summary',
        type: 'view',
        group: 'core'
    },
    {
        name: 'squad_rolling_trends',
        type: 'view',
        group: 'core'
    },
    {
        name: 'squad_stat_summary',
        type: 'view',
        group: 'core'
    },
    {
        name: '_gamer_matches_augmented',
        type: 'view',
        group: 'detail'
    },
    {
        name: 'analysis_teammate',
        type: 'view',
        group: 'detail'
    },
    {
        name: 'gamer_influence_relationships',
        type: 'view',
        group: 'detail'
    },
    {
        name: 'gamer_stats_graded',
        type: 'view',
        group: 'detail'
    },
    {
        name: 'followed_gamers',
        type: 'view',
        group: 'etl'
    },
    {
        name: 'matches_to_augment',
        type: 'view',
        group: 'etl'
    },
    {
        name: 'min_max_timestamps',
        type: 'view',
        group: 'etl'
    },
    {
        name: 'gamer_class_description_values',
        type: 'view',
        group: 'core',
        materialized: true
    },
    {
        name: 'gamer_rolling_trends_materialized',
        type: 'view',
        group: 'core',
        materialized: true
    },
    {
        name: 'gamer_stat_summary_materialized',
        type: 'view',
        group: 'core',
        materialized: true
    },
    {
        name: 'squad_class_description_values',
        type: 'view',
        group: 'core',
        materialized: true
    },
    {
        name: 'squad_stat_summary_materialized',
        type: 'view',
        group: 'core',
        materialized: true
    },
    {
        name: 'grading_table',
        type: 'view',
        group: 'detail',
        materialized: true
    },
    {
        name: 'gamer_stats_graded_materialized',
        type: 'view',
        group: 'detail',
        materialized: true
    },
    {
        name: 'gamer_influence_relationships_materialized',
        type: 'view',
        group: 'detail',
        materialized: true
    },
] as ViewConfigList;