SELECT * FROM warzone.gamer_rolling_trends_materialized
WHERE uno_id = CAST($1 AS NUMERIC(38, 0)) AND
start_timestamp >= CURRENT_TIMESTAMP - INTERVAL '$2 DAYS' AND
game_category = $3
ORDER BY start_timestamp