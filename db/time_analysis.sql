WITH source AS (

SELECT gm.*,
       EXTRACT(HOUR FROM to_timestamp(m.start_time) AT TIME ZONE $2) AS hour_of_timestamp,
       EXTRACT(DOW FROM to_timestamp(m.start_time) AT TIME ZONE $2) as day_of_week
FROM warzone.gamer_matches gm
         JOIN warzone.gamers g ON gm.uno_id = g.uno_id
         JOIN warzone.matches m ON gm.match_id = m.match_id
WHERE gm.uno_id = CAST($1 AS NUMERIC)
),
hours_mapped AS (
    SELECT *,
            'hour_of_day' AS analysis_type,
           $2                                                               as timezone,
           CASE
               WHEN hour_of_timestamp = 0 THEN '12 AM'
               WHEN hour_of_timestamp = 12 THEN '12 PM'
               WHEN hour_of_timestamp > 12 THEN
                       (hour_of_timestamp - 12) || ' PM'
               ELSE (hour_of_timestamp) || ' AM'
           END                                                       AS time_grain,
           hour_of_timestamp AS sorter
    FROM source
    WHERE game_category = $4
),
day_of_week_mapped AS (
    SELECT *,
           'day_of_week' AS analysis_type,
           $2                                                               as timezone,
           CASE
             WHEN day_of_week = 0 THEN 'Sunday'
                  WHEN day_of_week = 1 THEN 'Monday'
                   WHEN day_of_week = 2 THEN 'Tuesday'
                    WHEN day_of_week = 3 THEN 'Wednesday'
                     WHEN day_of_week = 4 THEN 'Thursday'
                      WHEN day_of_week = 5 THEN 'Friday'
                     WHEN day_of_week = 6 THEN 'Saturday'
                     END
            as time_grain,
           day_of_week AS sorter
    FROM source
    WHERE game_category = $4
),
combined AS (

    SELECT * FROM hours_mapped
    UNION ALL
    SELECT * FROM day_of_week_mapped
),

breakdown AS (
SELECT gm.query_username as username,
       gm.query_platform as platform,
       gm.analysis_type,
       gm.timezone,
       gm.time_grain,
       gm.sorter,
       CAST(SUM(kills) AS REAL) / SUM(deaths)                                   AS kdr,
       CAST(SUM(CASE WHEN team_type = 'duo' THEN kills END) AS REAL) /
        CASE WHEN SUM(CASE WHEN team_type = 'duo' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'duo' THEN deaths END)  END            AS duo_kdr,
            CAST(SUM(CASE WHEN team_type = 'trio' THEN kills END) AS REAL) /
           CASE WHEN SUM(CASE WHEN team_type = 'trio' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'trio' THEN deaths END)        END                     AS trio_kdr,

        CAST(SUM(CASE WHEN team_type = 'quad' THEN kills END) AS REAL) /
         CASE WHEN SUM(CASE WHEN team_type = 'quad' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'quad' THEN deaths END)     END                         AS quad_kdr,
       CAST(AVG(CASE WHEN team_type = 'quad' THEN team_placement END) AS REAL) AS avg_quad_placement,
       CAST(AVG(CASE WHEN team_type = 'trio' THEN team_placement END) AS REAL) AS avg_trio_placement,

       CAST(AVG(CASE WHEN team_type = 'duo' THEN team_placement END) AS REAL) AS avg_duo_placement,

       CAST(AVG(CASE WHEN team_type = 'solo' THEN team_placement END) AS REAL) AS avg_solo_placement,

       CAST(AVG(kills)  AS REAL) AS avg_kills,
       CAST(MAX(kills) AS REAL) AS max_kills,
       CAST(MAX(score) AS REAL) AS max_score,
       CAST(AVG(score) AS REAL) as avg_score,
           CAST(SUM(gulag_kills) AS REAL) /
                                 NULLIF(SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills)   ,0)                               as gulag_win_rate,
       CAST(COUNT(1)            AS REAL)                                                      AS num_games
FROM combined gm
GROUP BY 1, 2, 3, 4, 5, 6
HAVING COUNT(1) >= $3
ORDER BY gm.sorter
)

SELECT * FROM breakdown

