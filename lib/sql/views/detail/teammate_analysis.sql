CREATE OR REPLACE VIEW warzone.teammate_analysis AS
WITH source AS (
    SELECT m.start_timestamp,
           m.team_type,
           m.game_category,
           m.match_id,
           g.username as query_username,
           g.platform as query_platform,
           gm.team_placement,
           gm.kills,
           gm.damage_done,
           gm.score,
           gm.deaths,
           gm.gulag_kills,
           gm.gulag_deaths,
           gm.uno_id,
           COALESCE(g2.username, CAST(gm2.uno_id AS TEXT))                 AS helping_player,
           COALESCE(g2.platform, 'uno')                      AS helping_player_platform,
           gm2.kills                                         AS helper_kills,
           gm2.damage_done                                   AS helper_damage_done,
           gm2.score                                         AS helper_score,
           gm2.deaths                                        as helper_deaths,
           gm2.gulag_kills                                   AS helper_gulag_kills,
           gm2.gulag_deaths                                  AS helper_gulag_deaths,
           gm2.uno_id                                        AS helper_uno_id
    FROM warzone.gamer_matches gm
             JOIN warzone.gamers g ON gm.uno_id = g.uno_id
             JOIN warzone.matches m ON gm.match_id = m.match_id
             JOIN warzone.gamer_matches gm2
                       ON gm.team = gm2.team
                           AND gm.match_id = gm2.match_id
                           AND gm.uno_id <> gm2.uno_id
             LEFT JOIN warzone.gamers g2 ON g2.uno_id = gm2.uno_id

),
     with_teammates AS (
         SELECT game_category,
                gm.uno_id,
                helper_uno_id,
                MAX(gm.query_username)                                                    AS username,
                MAX(gm.query_platform)                                                    AS platform,
                MAX(helping_player)                                                       AS helping_player,
                MAX(helping_player_platform)                                              AS helping_player_platform,
                COUNT(DISTINCT gm.match_id)                                               AS num_matches,

                CAST(COUNT(CASE WHEN team_placement = 1 THEN match_id END) AS REAL) /
                NULLIF(COUNT(DISTINCT match_id), 0)                                       AS overall_win_rate,
                CAST(COUNT(CASE WHEN team_placement <= 10 THEN match_id END) AS REAL) /
                NULLIF(COUNT(DISTINCT match_id), 0)                                       AS overall_top_10_rate,

                CAST(COUNT(CASE WHEN team_type = 'duo' AND team_placement = 1 THEN match_id END) AS REAL) /
                NULLIF(COUNT(DISTINCT CASE WHEN team_type = 'duo' THEN match_id END), 0)  AS duo_win_rate,
                CAST(COUNT(CASE WHEN team_type = 'trio' AND team_placement = 1 THEN match_id END) AS REAL) /
                NULLIF(COUNT(DISTINCT CASE WHEN team_type = 'trio' THEN match_id END), 0) AS trio_win_rate,
                CAST(COUNT(CASE WHEN team_type = 'quad' AND team_placement = 1 THEN match_id END) AS REAL) /
                NULLIF(COUNT(DISTINCT CASE WHEN team_type = 'quad' THEN match_id END), 0) AS quad_win_rate,


                CAST(SUM(gm.kills) AS real) / NULLIF(CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END,
                                                     0)                                   AS kdr,


                CAST(SUM(gm.helper_kills) AS real) /
                NULLIF(CASE WHEN SUM(gm.helper_deaths) = 0 THEN 1 ELSE SUM(gm.helper_deaths) END,
                       0)                                                                 AS helper_kdr,
                CAST(SUM(gm.gulag_kills) AS REAL) /
                NULLIF(CASE
                           WHEN SUM(CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths ELSE 0 END + gm.gulag_kills) = 0
                               THEN 1
                           ELSE SUM(CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths ELSE 0 END + gm.gulag_kills)
                           END,
                       0)                                                                 as gulag_win_rate,

                CAST(SUM(gm.helper_gulag_kills) AS REAL) /
                NULLIF(CASE
                           WHEN SUM(CASE
                                        WHEN gm.helper_gulag_deaths <= 1 THEN gm.helper_gulag_deaths
                                        ELSE 0 END + gm.helper_gulag_kills) = 0 THEN 1
                           ELSE SUM(CASE WHEN gm.helper_gulag_deaths <= 1 THEN gm.helper_gulag_deaths ELSE 0 END +
                                    gm.helper_gulag_kills)
                           END,
                       0)                                                                 as helper_gulag_win_rate,
                SUM(gm.kills)                                                             AS total_kills,
                AVG(gm.kills)                                                             AS avg_kills,
                SUM(gm.helper_kills)                                                      AS total_helper_kills,
                AVG(gm.helper_kills)                                                      AS avg_helper_kills,
                SUM(gm.damage_done)                                                       AS total_damage_done,
                AVG(gm.damage_done)                                                       AS avg_damage_done,
                SUM(gm.helper_damage_done)                                                AS total_helper_damage_done,
                AVG(gm.helper_damage_done)                                                AS avg_helper_damage_done,
                SUM(gm.score)                                                             AS total_score,
                AVG(gm.score)                                                             AS avg_score,
                SUM(gm.helper_score)                                                      AS total_helper_score,
                AVG(gm.helper_score)                                                      AS avg_helper_score,
                SUM(gm.deaths)                                                            AS total_deaths,
                AVG(gm.deaths)                                                            AS avg_deaths,
                SUM(gm.helper_deaths)                                                     AS total_helper_deaths,
                AVG(gm.helper_deaths)                                                     AS avg_helper_deaths,
                MAX(gm.kills)                                                             AS max_kills,
                MAX(gm.deaths)                                                            AS max_deaths,
                AVG(CASE WHEN team_type = 'trio' THEN gm.team_placement END)              AS avg_trio_placement,
                AVG(CASE WHEN team_type = 'quad' THEN gm.team_placement END)              AS avg_quad_placement,
                AVG(CASE WHEN team_type = 'duo' THEN gm.team_placement END)               AS avg_duo_placement,
                AVG(CASE WHEN team_type = 'solo' THEN gm.team_placement END)              AS avg_solo_placement,
                MIN(start_timestamp)                                                      AS first_game_time,
                MAX(start_timestamp)                                                      AS last_game_time
         FROM source gm
         GROUP BY game_category, uno_id, helper_uno_id
     )

SELECT *
FROM with_teammates
ORDER BY num_matches DESC



