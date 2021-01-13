
CREATE OR REPLACE VIEW warzone.gamer_rolling_trends AS
    WITH valid_users AS (
             SELECT query_username, query_platform
             FROM warzone.gamer_matches
             GROUP BY 1, 2
             HAVING COUNT(1) >= 10
         ),
         rolling as (
        SELECT gm.query_username,
               gm.query_platform,
               username,
               start_timestamp,
               team_type,
               m.game_category,
               CAST(AVG(team_placement)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category, team_type ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS REAL)
                   AS last_100_rolling_average_placement,
               CAST(AVG(team_placement)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category, team_type ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW )  AS REAL)      AS last_30_rolling_average_placement,
               CAST(AVG(team_placement)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category, team_type ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )  AS REAL)       AS last_10_rolling_average_placement,
               CAST(AVG(kills)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )    AS REAL)                AS last_10_rolling_average_kills,
               CAST(AVG(kills)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW )    AS REAL)             AS last_30_rolling_average_kills,
               CAST(AVG(kills)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW )  AS REAL)                 AS last_100_rolling_average_kills,
                CAST(AVG(deaths)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )  AS REAL)                AS last_10_rolling_average_deaths,
               CAST(AVG(deaths)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS REAL)                AS last_30_rolling_average_deaths,
               CAST(AVG(deaths)
               OVER (PARTITION BY gm.query_platform, gm.query_username, game_category ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW )  AS REAL)                 AS last_100_rolling_average_deaths
        FROM warzone.gamer_matches gm
                 JOIN warzone.matches_augmented m on m.match_id = gm.match_id
                 JOIN valid_users v ON gm.query_username = v.query_username and gm.query_platform = v.query_platform
    ),
    overall AS (
            SELECT query_username,
                   query_platform,
                   username,
                   start_timestamp,
                   team_type,
                   '(all)' as game_category,
                   CAST(AVG(team_placement)
                   OVER (PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS REAL)
                       AS last_100_rolling_average_placement,
                   CAST(AVG(team_placement)
                   OVER (PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW )  AS REAL)      AS last_30_rolling_average_placement,
                   CAST(AVG(team_placement)
                   OVER (PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )  AS REAL)       AS last_10_rolling_average_placement,
                   CAST(AVG(kills)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )    AS REAL)                AS last_10_rolling_average_kills,
                   CAST(AVG(kills)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW )    AS REAL)             AS last_30_rolling_average_kills,
                   CAST(AVG(kills)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW )  AS REAL)                 AS last_100_rolling_average_kills,
                    CAST(AVG(deaths)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW )  AS REAL)                AS last_10_rolling_average_deaths,
                   CAST(AVG(deaths)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS REAL)                AS last_30_rolling_average_deaths,
                   CAST(AVG(deaths)
                   OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW )  AS REAL)                 AS last_100_rolling_average_deaths
            FROM warzone.gamer_matches gm
                     JOIN warzone.matches_augmented m on m.match_id = gm.match_id
    ),
    combined AS (
        SELECT * FROM rolling
        UNION ALL
        SELECT * FROM overall
    )

SELECT *,
       CAST(last_10_rolling_average_kills/NULLIF(last_10_rolling_average_deaths, 0) AS REAL) AS last_10_rolling_average_kdr,
       CAST(last_30_rolling_average_kills/NULLIF(last_30_rolling_average_deaths, 0) AS REAL) AS last_30_rolling_average_kdr,
       CAST(last_100_rolling_average_kills/NULLIF(last_100_rolling_average_deaths, 0) AS REAL) AS last_100_rolling_average_kdr
    FROM combined