CREATE UNIQUE INDEX player_stat_summary_unique ON warzone.player_stat_summary_materialized (username, platform, game_category)

CREATE UNIQUE INDEX gamer_rolling_trends_unique ON warzone.gamer_rolling_trends_materialized (username, platform, game_category)
