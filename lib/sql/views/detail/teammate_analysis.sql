CREATE OR REPLACE VIEW warzone.teammate_analysis AS
WITH source AS (
    SELECT m.start_timestamp,
           m.team_type,
           m.game_category,
           m.match_id,
           gm.query_username,
           gm.query_platform,
           gm.team_placement,
           gm.kills,
           gm.damage_done,
           gm.score,
           gm.deaths,
           gm.gulag_kills,
           gm.gulag_deaths,
           COALESCE(gm2.query_username, 'without teammates') AS helping_player,
           COALESCE(gm2.query_platform, 'without teammates') AS helping_player_platform,
           gm2.kills                                         AS helper_kills,
           gm2.damage_done                                   AS helper_damage_done,
           gm2.score                                         AS helper_score,
           gm2.deaths                                        as helper_deaths,
           gm2.gulag_kills                                   AS helper_gulag_kills,
           gm2.gulag_deaths                                  AS helper_gulag_deaths
    FROM warzone.gamer_matches gm
            JOIN warzone.gamers g ON gm.query_username = g.username and gm.query_platform = g.platform
             JOIN warzone.matches m ON gm.match_id = m.match_id
             LEFT JOIN warzone.gamer_matches gm2
                       ON gm.team = gm2.team
                           AND gm.match_id = gm2.match_id
                           AND CONCAT(gm.query_platform, '-', gm.query_username) <>
                               CONCAT(gm2.query_platform, '-', gm2.query_username)
),
     with_teammates AS (
         SELECT game_category,
                gm.query_username                                                                                    AS username,
                gm.query_platform                                                                                    AS platform,
                helping_player,
                helping_player_platform,
                COUNT(DISTINCT gm.match_id)                                                                          AS num_matches,
                CAST(SUM(gm.kills) AS real) / NULLIF(CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END,
                                                     0)                                                              AS kdr,


                CAST(SUM(gm.helper_kills) AS real) /
                NULLIF(CASE WHEN SUM(gm.helper_deaths) = 0 THEN 1 ELSE SUM(gm.helper_deaths) END,
                       0)                                                                                            AS helper_kdr,
                CAST(SUM(gm.gulag_kills) AS REAL) /
                NULLIF(CASE
                           WHEN SUM(CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths ELSE 0 END + gm.gulag_kills) = 0
                               THEN 1
                           ELSE SUM(CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths ELSE 0 END + gm.gulag_kills)
                           END,
                       0)                                                                                            as gulag_win_rate,

                CAST(SUM(gm.helper_gulag_kills) AS REAL) /
                NULLIF(CASE
                           WHEN SUM(CASE
                                        WHEN gm.helper_gulag_deaths <= 1 THEN gm.helper_gulag_deaths
                                        ELSE 0 END + gm.helper_gulag_kills) = 0 THEN 1
                           ELSE SUM(CASE WHEN gm.helper_gulag_deaths <= 1 THEN gm.helper_gulag_deaths ELSE 0 END +
                                    gm.helper_gulag_kills)
                           END,
                       0)                                                                                            as helper_gulag_win_rate,
                SUM(gm.kills)                                                                                        AS total_kills,
                AVG(gm.kills)                                                                                        AS avg_kills,
                SUM(gm.helper_kills)                                                                                 AS total_helper_kills,
                AVG(gm.helper_kills)                                                                                 AS avg_helper_kills,
                SUM(gm.damage_done)                                                                                  AS total_damage_done,
                AVG(gm.damage_done)                                                                                  AS avg_damage_done,
                SUM(gm.helper_damage_done)                                                                           AS total_helper_damage_done,
                AVG(gm.helper_damage_done)                                                                           AS avg_helper_damage_done,
                SUM(gm.score)                                                                                        AS total_score,
                AVG(gm.score)                                                                                        AS avg_score,
                SUM(gm.helper_score)                                                                                 AS total_helper_score,
                AVG(gm.helper_score)                                                                                 AS avg_helper_score,
                SUM(gm.deaths)                                                                                       AS total_deaths,
                AVG(gm.deaths)                                                                                       AS avg_deaths,
                SUM(gm.helper_deaths)                                                                                AS total_helper_deaths,
                AVG(gm.helper_deaths)                                                                                AS avg_helper_deaths,
                MAX(gm.kills)                                                                                        AS max_kills,
                MAX(gm.deaths)                                                                                       AS max_deaths,
                AVG(CASE WHEN team_type = 'trio' THEN gm.team_placement END)                                         AS avg_trio_placement,
                AVG(CASE WHEN team_type = 'quad' THEN gm.team_placement END)                                         AS avg_quad_placement,
                AVG(CASE WHEN team_type = 'duo' THEN gm.team_placement END)                                          AS avg_duo_placement,
                AVG(CASE WHEN team_type = 'solo' THEN gm.team_placement END)                                         AS avg_solo_placement,
                MIN(start_timestamp)                                                                                 AS first_game_time,
                MAX(start_timestamp)                                                                                 AS last_game_time
         FROM source gm
         GROUP BY game_category, query_username, query_platform, helping_player, helping_player_platform
     )

SELECT *
FROM with_teammates
ORDER BY num_matches DESC



