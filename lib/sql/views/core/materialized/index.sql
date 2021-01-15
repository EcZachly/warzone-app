CREATE UNIQUE INDEX gamer_stat_summary_materialized_unique ON warzone.gamer_stat_summary_materialized(username, platform, game_category);
CREATE UNIQUE INDEX gamer_rolling_trends_unique ON warzone.gamer_rolling_trends_materialized(query_username, query_platform, start_timestamp);
CREATE UNIQUE INDEX squad_class_description_values_unique ON warzone.squad_class_description_values(team_type, game_category);
CREATE UNIQUE INDEX gamer_class_description_values_unique ON warzone.gamer_class_description_values(game_category);
CREATE UNIQUE INDEX squad_stat_summary_materialized_unique ON warzone.squad_stat_summary_materialized(team_grain, team_type, game_category);