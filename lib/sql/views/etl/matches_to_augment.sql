CREATE OR REPLACE VIEW warzone.matches_to_augment AS
SELECT
    gm.match_id,
    MAX(m.player_count) as total_players,
    COUNT(1) AS num_players

FROM warzone.gamer_matches gm JOIN warzone.matches m ON m.match_id = gm.match_id
GROUP BY 1
HAVING CAST(COUNT(1) AS REAL)/MAX(m.player_count) < .95