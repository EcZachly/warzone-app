SELECT * FROM warzone.gamer_rolling_trends
WHERE
query_username = $1 AND
query_platform = $2 AND
start_timestamp >= CURRENT_TIMESTAMP - INTERVAL '$3 DAYS'
ORDER BY start_timestamp