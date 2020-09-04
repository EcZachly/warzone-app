CREATE VIEW min_max_timestamps AS
SELECT gm.query_username, MAX(start_time) as last_timestamp, MIN(start_time) as first_timestamp
FROM gamer_matches gm
    JOIN matches m ON gm.match_id = m.match_id
GROUP BY 1