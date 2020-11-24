CREATE MATERIALIZED VIEW warzone.gamer_heat_ratings AS
WITH last_timestamps AS (
    SELECT
        query_username,
        query_platform,
        MAX(gm.start_timestamp) AS latest_game_timestamp
    FROM warzone.gamer_rolling_trends gm
    GROUP BY query_username, query_platform
)
SELECT
       last_10_rolling_average_kdr/last_100_rolling_average_kdr AS heat_index_10_100,
       last_10_rolling_average_kdr/last_30_rolling_average_kdr as head_index_10_30,
       last_30_rolling_average_kdr/last_100_rolling_average_kdr as head_index_30_100,
       CASE
           WHEN last_10_rolling_average_kdr/last_100_rolling_average_kdr < 1 THEN 0
           WHEN last_10_rolling_average_kdr/last_100_rolling_average_kdr < 1.1 THEN 1
           WHEN last_10_rolling_average_kdr/last_100_rolling_average_kdr < 1.2 THEN 2
           WHEN last_10_rolling_average_kdr/last_100_rolling_average_kdr < 1.3 THEN 3
           WHEN last_10_rolling_average_kdr/last_100_rolling_average_kdr < 1.4 THEN 4
           ELSE 5
        END as heat_rating,
       last_10_rolling_average_kdr,
       last_30_rolling_average_kdr,
       last_100_rolling_average_kdr,
       grt.query_username,
       grt.query_platform,
       latest_game_timestamp
FROM warzone.gamer_rolling_trends grt
    JOIN last_timestamps lt
        ON grt.query_platform = lt.query_platform
               AND grt.query_username = lt.query_username
               AND grt.start_timestamp = lt.latest_game_timestamp