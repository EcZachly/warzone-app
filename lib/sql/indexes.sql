CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.player_stat_summary_materialized (username, platform, game_category)
CREATE UNIQUE INDEX gamer_rolling_trends_unique ON warzone.gamer_rolling_trends_materialized (username, platform, game_category)
CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.player_stat_summary_materialized (username, platform, game_category)
CREATE UNIQUE INDEX mutual_benefit_relationships_unique ON warzone.mutual_benefit_relationships_materialized (username, platform, helping_player, helping_player_platform, relationship_stat, relationship_stat, game_category)
CREATE UNIQUE INDEX gamer_matches_unique ON warzone.gamer_matches (query_username, query_platform, match_id)
CREATE INDEX gamer_matches_username_platform ON warzone.gamer_matches (query_username, query_platform)
CREATE INDEX gamer_matches_matches ON warzone.gamer_matches (match_id)


