CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.player_stat_summary_materialized (username, platform, game_category)
CREATE UNIQUE INDEX mutual_benefit_relationships_unique ON warzone.mutual_benefit_relationships_materialized (username, platform, helping_player, helping_player_platform, relationship_stat, relationship_stat, game_category)
