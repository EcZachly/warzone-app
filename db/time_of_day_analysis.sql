SELECT gm.query_username as username,
       gm.query_platform as platform,
       $1                                                                as timezone,
       CASE
           WHEN DATE_PART('hour', to_timestamp(m.start_time) AT TIME ZONE $1) = 0 THEN '12 AM'

           WHEN DATE_PART('hour', to_timestamp(m.start_time) AT TIME ZONE $1) = 12 THEN '12 PM'
           WHEN DATE_PART('hour', to_timestamp(m.start_time) AT TIME ZONE $1) > 12 THEN
                   (DATE_PART('hour', to_timestamp(m.start_time) AT TIME ZONE $1) - 12) || ' PM'
           ELSE (DATE_PART('hour', to_timestamp(m.start_time) AT TIME ZONE $1)) ||
                ' AM' END                                                       AS hour_of_play,
       DATE_PART('hour',
                 to_timestamp(m.start_time) AT TIME ZONE $1) AS sorter,
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
                                 SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills)                                  as gulag_win_rate,
       COUNT(1)                                                                 AS num_games
FROM warzone.gamer_matches gm
         JOIN warzone.matches_augmented m ON gm.match_id = m.match_id
WHERE m.is_warzone_match = TRUE
AND gm.query_username = $2
AND gm.query_platform = $3
GROUP BY 1, 2, 3, 4, 5
HAVING COUNT(1) >= $4
ORDER BY sorter
