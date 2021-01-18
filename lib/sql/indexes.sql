CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.gamer_stat_summary_materialized (username, platform, game_category)
CREATE UNIQUE INDEX gamer_rolling_trends_unique ON warzone.gamer_rolling_trends_materialized (query_username, query_platform, start_timestamp, game_category)
CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.gamer_stat_summary_materialized (username, platform, game_category)
CREATE UNIQUE INDEX mutual_benefit_relationships_unique ON warzone.gamer_influence_relationships_materialized (username, platform, helping_player, helping_player_platform, relationship_stat, relationship_stat, game_category)
CREATE UNIQUE INDEX gamer_matches_unique ON warzone.gamer_matches (query_username, query_platform, match_id)
CREATE INDEX gamer_matches_uno_id ON warzone.gamer_matches (uno_id)
CREATE INDEX gamer_matches_matches ON warzone.gamer_matches (match_id)
CREATE INDEX team_type_category ON warzone.matches(team_type, game_category, start_timestamp)


