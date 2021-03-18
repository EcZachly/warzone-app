CREATE OR REPLACE VIEW warzone.gamer_rolling_trends AS

WITH rolling as (
         SELECT
                gm.username,
                gm.uno_id,
                start_timestamp,
                game_category,
                CAST(AVG(kills)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 9 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_10_rolling_average_kills,
                CAST(AVG(kills)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 29 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_30_rolling_average_kills,
                CAST(AVG(kills)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_kills,
                CAST(AVG(deaths)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 9 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_10_rolling_average_deaths,
                CAST(AVG(deaths)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 29 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_30_rolling_average_deaths,
                CAST(AVG(deaths)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_deaths,
                CAST(AVG(assists)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 9 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_10_rolling_average_assists,
                CAST(AVG(assists)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS REAL)  AS last_30_rolling_average_assists,
                CAST(AVG(assists)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_assists,
                CAST(AVG(CASE WHEN gulag_kills >= 1 then 1 else 0 end)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_gulag_kills,
                CAST(AVG(CASE WHEN gulag_deaths >= 1 then 1 else 0 end)
                     OVER (PARTITION BY  gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_rolling_average_gulag_deaths,
                CAST(AVG(CASE WHEN team_type = 'solo' THEN kills end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_solo_rolling_average_kills,
                CAST(AVG(CASE WHEN team_type = 'duo' THEN kills end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_duo_rolling_average_kills,
                CAST(AVG(CASE WHEN team_type = 'trio' THEN kills end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_trio_rolling_average_kills,
                CAST(AVG(CASE WHEN team_type = 'quad' THEN kills end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_quad_rolling_average_kills,

                CAST(AVG(CASE WHEN team_type = 'solo' THEN deaths end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_solo_rolling_average_deaths,
                CAST(AVG(CASE WHEN team_type = 'duo' THEN deaths end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_duo_rolling_average_deaths,
                CAST(AVG(CASE WHEN team_type = 'trio' THEN deaths end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_trio_rolling_average_deaths,
                CAST(AVG(CASE WHEN team_type = 'quad' THEN deaths end)
                     OVER (PARTITION BY gm.uno_id, game_category ORDER BY gm.start_timestamp ROWS BETWEEN 99 PRECEDING AND CURRENT ROW ) AS REAL) AS last_100_quad_rolling_average_deaths
         FROM warzone.gamer_matches gm
                  JOIN warzone.gamers g ON gm.uno_id = g.uno_id
     ),
     include_kdrs AS (
         SELECT *,
                CAST(last_10_rolling_average_kills /
                     NULLIF(last_10_rolling_average_deaths, 0) AS REAL) AS  last_10_rolling_average_kdr,
                CAST(last_30_rolling_average_kills /
                     NULLIF(last_30_rolling_average_deaths, 0) AS REAL) AS  last_30_rolling_average_kdr,
                CAST(last_100_rolling_average_kills /
                     NULLIF(last_100_rolling_average_deaths, 0) AS REAL) AS last_100_rolling_average_kdr,

                CAST(last_100_solo_rolling_average_kills /
                     NULLIF(last_100_solo_rolling_average_deaths, 0) AS REAL) AS last_100_solo_rolling_average_kdr,
                CAST(last_100_duo_rolling_average_kills /
                     NULLIF(last_100_duo_rolling_average_deaths, 0) AS REAL) AS last_100_duo_rolling_average_kdr,
                CAST(last_100_trio_rolling_average_kills /
                     NULLIF(last_100_trio_rolling_average_deaths, 0) AS REAL) AS last_100_trio_rolling_average_kdr,
                CAST(last_100_quad_rolling_average_kills /
                     NULLIF(last_100_quad_rolling_average_deaths, 0) AS REAL) AS last_100_quad_rolling_average_kdr,

                CAST((last_10_rolling_average_kills + (last_10_rolling_average_assists / 2)) /
                     NULLIF(last_10_rolling_average_deaths, 0) AS REAL) AS  last_10_rolling_average_kadr,
                CAST((last_30_rolling_average_kills + (last_30_rolling_average_assists / 2)) /
                     NULLIF(last_30_rolling_average_deaths, 0) AS REAL) AS  last_30_rolling_average_kadr,
                CAST((last_100_rolling_average_kills + (last_100_rolling_average_assists / 2)) /
                     NULLIF(last_100_rolling_average_deaths, 0) AS REAL) AS last_100_rolling_average_kadr,
                CAST(last_100_rolling_average_gulag_kills /
                     NULLIF(last_100_rolling_average_gulag_deaths, 0) AS REAL) AS last_100_rolling_average_gulag_kdr,
                CASE
                    WHEN LEAD(uno_id, 1)
                         OVER (PARTITION BY uno_id, game_category ORDER BY start_timestamp) IS NULL
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
