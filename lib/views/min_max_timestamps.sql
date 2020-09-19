CREATE OR REPLACE VIEW warzone.min_max_timestamps AS
SELECT gm.query_username, gm.query_platform, MAX(end_time)*1000 as last_timestamp, MIN(start_time)*1000 as first_timestamp
FROM warzone.gamer_matches gm
    JOIN warzone.matches m ON gm.match_id = m.match_id
GROUP BY gm.query_username, gm.query_platform