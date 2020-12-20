SELECT * FROM warzone.gamer_rolling_trends_materialized
WHERE
query_username = $1 AND
query_platform = $2 AND
start_timestamp >= CURRENT_TIMESTAMP - INTERVAL '$3 DAYS' AND
game_category = $4
ORDER BY start_timestamp