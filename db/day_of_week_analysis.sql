-- DEPRECATE ONCE WE FINISH MIGRATING
WITH source AS (

SELECT *,

       EXTRACT(DOW FROM to_timestamp(m.start_time) AT TIME ZONE $1) as day_of_week,
       EXTRACT(DOW FROM to_timestamp(m.start_time) AT TIME ZONE $1) as sorter
FROM warzone.gamer_matches gm
         JOIN warzone.matches_augmented m ON gm.match_id = m.match_id
WHERE m.is_warzone_match = TRUE
AND gm.query_username = $2
AND gm.query_platform = $3

)


SELECT query_username as username,
       query_platform as platform,
       $1                                                                as timezone,
       CASE
        WHEN day_of_week = 0 THEN 'Sunday'
             WHEN day_of_week = 1 THEN 'Monday'
              WHEN day_of_week = 2 THEN 'Tuesday'
               WHEN day_of_week = 3 THEN 'Wednesday'
                WHEN day_of_week = 4 THEN 'Thursday'
                 WHEN day_of_week = 5 THEN 'Friday'
                WHEN day_of_week = 6 THEN 'Saturday'
                END
       as day_of_week,
       sorter,
       CAST(SUM(kills) AS REAL) / SUM(deaths)                                   AS kdr,

       CAST(SUM(CASE WHEN team_type = 'duo' THEN kills END) AS REAL) /
      CAST(SUM(CASE WHEN team_type = 'duo' THEN kills END) AS REAL) /
            CASE WHEN SUM(CASE WHEN team_type = 'duo' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'duo' THEN deaths END)    END          AS duo_kdr,
                CAST(SUM(CASE WHEN team_type = 'trio' THEN kills END) AS REAL) /
               CASE WHEN SUM(CASE WHEN team_type = 'trio' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'trio' THEN deaths END)     END                       AS trio_kdr,

            CAST(SUM(CASE WHEN team_type = 'quad' THEN kills END) AS REAL) /
             CASE WHEN SUM(CASE WHEN team_type = 'quad' THEN deaths END)  =  0 THEN 1 ELSE SUM(CASE WHEN team_type = 'quad' THEN deaths END)      END                        AS quad_kdr,
                   CAST(AVG(CASE WHEN team_type = 'quad' THEN team_placement END) AS REAL) AS avg_quad_placement,
                    CAST(AVG(CASE WHEN team_type = 'trio' THEN team_placement END) AS REAL) AS avg_trio_placement,

                    CAST(AVG(CASE WHEN team_type = 'duo' THEN team_placement END) AS REAL) AS avg_duo_placement,

                    CAST(AVG(CASE WHEN team_type = 'solo' THEN team_placement END) AS REAL) AS avg_solo_placement,
           CAST(AVG(kills)  AS REAL) AS avg_kills,
               CAST(MAX(kills) AS REAL) AS max_kills,

                  CAST(MAX(score) AS REAL) AS max_score,
               CAST(AVG(score) AS REAL) as avg_score,
                    CAST(SUM(gulag_kills) AS REAL) /
                          SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills)                                  as gulag_win_rate,
       COUNT(1)                                                                 AS num_games
FROM source
GROUP BY 1, 2, 3, 4, 5
HAVING COUNT(1) >= $4
ORDER BY sorter
