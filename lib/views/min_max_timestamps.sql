CREATE VIEW warzone.min_max_timestamps AS
SELECT gm.query_username, gm.query_platform, MAX(end_time) as last_timestamp, MIN(start_time) as first_timestamp
FROM warzone.gamer_matches gm
    JOIN warzone.matches m ON gm.match_id = m.match_id
GROUP BY 1, 2