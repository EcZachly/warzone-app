CREATE OR REPLACE VIEW warzone.teammate_analysis AS
WITH source AS (
    SELECT
            m.start_timestamp,
            m.team_type,
            gm.*,
            COALESCE(gm2.query_username, 'without teammates')  AS helping_player_temp,
            COALESCE(gm2.query_platform, 'without teammates') AS helping_player_platform
    FROM warzone.gamer_matches gm
         JOIN warzone.matches_augmented m
            ON gm.match_id = m.match_id AND m.is_warzone_match = TRUE
         LEFT JOIN warzone.gamer_matches gm2
                   ON gm.team = gm2.team
                       AND gm.match_id = gm2.match_id
                       AND CONCAT(gm.query_platform, '-', gm.query_username) <> CONCAT(gm.query_platform, '-', gm2.query_username)
),
     overall AS (
          SELECT
          gm.query_username as shooting_player,
          gm.query_platform AS shooting_player_platform,
       '(overall)' as helping_player_temp,
       '(overall)' as helping_player_platform,
        COUNT(DISTINCT gm.match_id)                                                               AS num_matches,
        CAST(SUM(gm.kills) AS real) / CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END AS kdr,
       CAST(SUM(gm.gulag_kills) AS REAL)/SUM( CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths END + gm.gulag_kills) as gulag_win_rate,
       SUM(gm.kills)                                                                             AS total_kills,
       AVG(gm.kills)                                                                             AS avg_kills,
       SUM(gm.damage_done)                                                                             AS total_damage_done,
       AVG(gm.damage_done)                                                                             AS avg_damage_done,
       SUM(gm.score)                                                                             AS total_score,
       AVG(gm.score)                                                                             AS avg_score,
       SUM(gm.deaths)                                                                            AS total_deaths,
       AVG(gm.deaths)                                                                            AS avg_deaths,
       MAX(gm.kills)                                                                             AS max_kills,
       MAX(gm.deaths)                                                                            AS max_deaths,
       AVG(CASE WHEN team_type = 'trio' THEN gm.team_placement END)                               AS avg_trio_placement,
       AVG(CASE WHEN team_type = 'quad' THEN gm.team_placement END)                               AS avg_quad_placement,
       AVG(CASE WHEN team_type = 'duo' THEN gm.team_placement END)                                AS avg_duo_placement,
       AVG(CASE WHEN team_type = 'solo' THEN gm.team_placement END)                               AS avg_solo_placement,
       SUM(COALESCE(CAST(objective->>'teams_wiped' AS INT), 0))                                                            AS total_teams_wiped,
       AVG(COALESCE(CAST(objective->>'teams_wiped' AS INT), 0))                                                            AS avg_teams_wiped,
       SUM(COALESCE(CAST(objective->>'missions_started' AS INT), 0))                                                       AS total_missions_started,
       AVG(COALESCE(CAST(objective->>'missions_started' AS INT), 0))                                                       AS avg_missions_started,
       MIN(start_timestamp)                                                                      AS first_game_time,
       MAX(start_timestamp)                                                                      AS last_game_time
    FROM warzone.gamer_matches gm
          JOIN warzone.matches_augmented m on gm.match_id = m.match_id
          AND m.is_warzone_match = TRUE
         GROUP BY gm.query_username, gm.query_platform, helping_player_temp

     ),
     with_teammates AS (

         SELECT
         gm.query_username AS shooting_player,
         gm.query_platform AS shooting_player_platform,
       helping_player_temp,
       helping_player_platform,
        COUNT(DISTINCT gm.match_id)                                                               AS num_matches,
        CAST(SUM(gm.kills) AS real) / CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END AS kdr,
       CAST(SUM(gm.gulag_kills) AS REAL)/SUM( CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths END + gm.gulag_kills) as gulag_win_rate,
       SUM(gm.kills)                                                                             AS total_kills,
       AVG(gm.kills)                                                                             AS avg_kills,
       SUM(gm.damage_done)                                                                             AS total_damage_done,
       AVG(gm.damage_done)                                                                             AS avg_damage_done,
       SUM(gm.score)                                                                             AS total_score,
       AVG(gm.score)                                                                             AS avg_score,
       SUM(gm.deaths)                                                                            AS total_deaths,
       AVG(gm.deaths)                                                                            AS avg_deaths,
       MAX(gm.kills)                                                                             AS max_kills,
       MAX(gm.deaths)                                                                            AS max_deaths,
       AVG(CASE WHEN team_type = 'trio' THEN gm.team_placement END)                               AS avg_trio_placement,
       AVG(CASE WHEN team_type = 'quad' THEN gm.team_placement END)                               AS avg_quad_placement,
       AVG(CASE WHEN team_type = 'duo' THEN gm.team_placement END)                                AS avg_duo_placement,
       AVG(CASE WHEN team_type = 'solo' THEN gm.team_placement END)                               AS avg_solo_placement,
       SUM(COALESCE(CAST(objective->>'teams_wiped' AS INT), 0))                                                            AS total_teams_wiped,
       AVG(COALESCE(CAST(objective->>'teams_wiped' AS INT), 0))                                                            AS avg_teams_wiped,
       SUM(COALESCE(CAST(objective->>'missions_started' AS INT), 0))                                                       AS total_missions_started,
       AVG(COALESCE(CAST(objective->>'missions_started' AS INT), 0))                                                       AS avg_missions_started,
       MIN(start_timestamp)                                                                      AS first_game_time,
       MAX(start_timestamp)                                                                      AS last_game_time
FROM source gm
GROUP BY gm.query_username, gm.query_platform, helping_player_temp, helping_player_platform
HAVING COUNT(DISTINCT gm.match_id) >= 10
     ),
     combined AS (

         SELECT * FROM overall
         UNION ALL
         SElECT * FROM with_teammates
     ),
     unboxed AS (
        SELECT
            COALESCE(ps.username, c.helping_player_temp) AS helping_player,
             c.*
        FROM combined c
            LEFT JOIN warzone.player_stat_summary ps ON ps.aliases @> ARRAY[c.helping_player_temp]
     )

     SELECT * FROM unboxed;



