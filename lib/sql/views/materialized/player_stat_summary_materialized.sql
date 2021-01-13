CREATE MATERIALIZED VIEW warzone.player_stat_summary_materialized AS
SELECT * FROM warzone.player_stat_summary
WHERE num_matches >= 5;