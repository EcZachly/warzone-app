CREATE OR REPLACE VIEW warzone.gamer_rolling_trends AS

WITH valid_users AS (
    SELECT query_username, query_platform
    FROM warzone.gamer_matches
    GROUP BY 1, 2
    HAVING COUNT(1) >= 100
),
     rolling as (
         SELECT gm.query_username,
                gm.query_platform,
                username,
                start_timestamp,
                m.game_category,
                CAST(AVG(kills)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_10_rolling_average_kills,
                CAST(AVG(kills)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_30_rolling_average_kills,
                CAST(AVG(kills)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_kills,
                CAST(AVG(deaths)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_10_rolling_average_deaths,
                CAST(AVG(deaths)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_30_rolling_average_deaths,
                CAST(AVG(deaths)
                     OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_deaths
         FROM warzone.gamer_matches gm
                  JOIN warzone.matches m on m.match_id = gm.match_id
                  JOIN valid_users v ON gm.query_username = v.query_username and gm.query_platform = v.query_platform
     ),
     include_kdrs AS (
         SELECT *,
                CAST(last_10_rolling_average_kills /
                     NULLIF(last_10_rolling_average_deaths, 0) AS REAL) AS  last_10_rolling_average_kdr,
                CAST(last_30_rolling_average_kills /
                     NULLIF(last_30_rolling_average_deaths, 0) AS REAL) AS  last_30_rolling_average_kdr,
                CAST(last_100_rolling_average_kills /
                     NULLIF(last_100_rolling_average_deaths, 0) AS REAL) AS last_100_rolling_average_kdr,
                CASE
                    WHEN LEAD(query_username, 1)
                         OVER (PARTITION BY query_username, query_platform, game_category ORDER BY start_timestamp) IS NULL
                        THEN TRUE
                    ELSE FALSE END as                                       is_latest_game
         FROM rolling
     )

SELECT *,
       last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) AS heat_index_10_100,
       last_10_rolling_average_kdr / NULLIF(last_30_rolling_average_kdr, 0)  as head_index_10_30,
       last_30_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) as head_index_30_100,
       CASE
           WHEN last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) <= 1 THEN 0
           WHEN last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) < 1.1 THEN 1
           WHEN last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) < 1.2 THEN 2
           WHEN last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) < 1.3 THEN 3
           WHEN last_10_rolling_average_kdr / NULLIF(last_100_rolling_average_kdr, 0) < 1.4 THEN 4
           ELSE 5
           END                                                               as heat_rating
FROM include_kdrs


