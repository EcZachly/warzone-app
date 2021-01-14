CREATE MATERIALIZED VIEW warzone.daily_player_stat_summary_materialized AS
SELECT * FROM warzone.daily_player_stat_summary
ORDER BY username, game_day DESC

