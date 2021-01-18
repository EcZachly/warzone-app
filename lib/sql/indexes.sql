CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.gamer_stat_summary_materialized (uno_id, game_category);
CREATE UNIQUE INDEX gamer_rolling_trends_unique ON warzone.gamer_rolling_trends_materialized (uno_id, start_timestamp, game_category);
CREATE UNIQUE INDEX gamer_influence_relationships_unique ON warzone.gamer_influence_relationships_materialized (uno_id, helper_uno_id, relationship_stat, relationship_stat, game_category)
CREATE UNIQUE INDEX gamer_matches_unique ON warzone.gamer_matches (uno_id, match_id)
CREATE UNIQUE INDEX squad_class_description_values_unique ON warzone.squad_class_description_values(team_type, game_category);
CREATE UNIQUE INDEX gamer_class_description_values_unique ON warzone.gamer_class_description_values(game_category);
CREATE UNIQUE INDEX squad_stat_summary_materialized_unique ON warzone.squad_stat_summary_materialized(team_grain, team_type, game_category);
CREATE UNIQUE INDEX grading_table_unique ON warzone.grading_table(game_category);
CREATE UNIQUE INDEX gamer_stats_graded_unique ON warzone.gamer_stats_graded_materialized(uno_id, game_category);
CREATE UNIQUE INDEX gamer_influence_relationships_materialized_unique ON warzone.gamer_influence_relationships_materialized(game_category, username, platform, helping_player, helping_player_platform, relationship_stat);
CREATE INDEX gamer_matches_uno_id ON warzone.gamer_matches (uno_id);
CREATE INDEX gamer_matches_matches ON warzone.gamer_matches (match_id);
CREATE INDEX team_type_category ON warzone.matches(team_type, game_category, start_timestamp)


