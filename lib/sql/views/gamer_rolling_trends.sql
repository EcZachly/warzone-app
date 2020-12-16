CREATE VIEW warzone.gamer_rolling_trends AS
    WITH rolling as (
        SELECT query_username,
               query_platform,
               username,
               start_timestamp,
               team_type,
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
               OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW )  AS REAL)                 AS last_100_rolling_average_deaths,
               CAST(AVG(team_placement)
               OVER (PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS REAL) AS since_start_rolling_average_placement,
               CAST(AVG(kills)
               OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  AS REAL)            AS since_start_rolling_average_kills,
               CAST(AVG(deaths)
               OVER (PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  AS REAL)          as since_start_rolling_average_deaths
        FROM warzone.gamer_matches gm
                 JOIN warzone.matches_augmented m on m.match_id = gm.match_id
        WHERE m.is_warzone_match = TRUE
    )

SELECT *,
       CAST(last_10_rolling_average_kills/NULLIF(last_10_rolling_average_deaths, 0) AS REAL) AS last_10_rolling_average_kdr,
       CAST(last_30_rolling_average_kills/NULLIF(last_30_rolling_average_deaths, 0) AS REAL) AS last_30_rolling_average_kdr,
       CAST(last_100_rolling_average_kills/NULLIF(last_100_rolling_average_deaths, 0) AS REAL) AS last_100_rolling_average_kdr,

       CAST(since_start_rolling_average_kills/NULLIF(since_start_rolling_average_deaths, 0) AS REAL) AS since_start_rolling_average_kdr
    FROM rolling