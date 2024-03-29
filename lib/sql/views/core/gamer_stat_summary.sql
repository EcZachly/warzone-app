CREATE OR REPLACE view warzone.gamer_stat_summary as
(
WITH agg AS (
    SELECT gm.game_category                                                                AS game_category,
           gm.uno_id                                                                       AS uno_id,
           MAX(COALESCE(g.username, CAST(gm.uno_id AS TEXT)))                              AS username,
           MAX(COALESCE(g.platform, 'uno'))                                                AS platform,
           ARRAY_AGG(DISTINCT gm.username)                                                 AS aliases,
           ARRAY_TO_STRING(ARRAY_AGG(DISTINCT gm.username), '-')                           AS aliases_search_string,
           CAST(MAX(kills) AS BIGINT)                                                      AS max_kills,
           CAST(MAX(deaths) AS BIGINT)                                                     as max_deaths,
           CAST(MAX(damage_done) AS BIGINT)                                                AS max_damage_done,
           CAST(MAX(damage_taken) AS BIGINT)                                               AS max_damage_taken,
           CAST(AVG(kills) AS REAL)                                                        as avg_kills,
           CAST(AVG(deaths) AS REAL)                                                       as avg_deaths,
           CAST(AVG(damage_done) AS REAL)                                                  as avg_damage_done,
           CAST(AVG(damage_taken) AS REAL)                                                 AS avg_damage_taken,
           CAST(SUM(damage_done) AS BIGINT)                                                AS total_damage_done,
           CAST(SUM(damage_taken) AS BIGINT)                                               AS total_damage_taken,
           CAST(SUM(kills) AS BIGINT)                                                      as total_kills,
           CAST(SUM(deaths) AS BIGINT)                                                     as total_deaths,
           CAST(SUM(kills) AS REAL) / COALESCE(NULLIF(SUM(deaths), 0), 1)                  as KDR,

           CAST(SUM(gulag_kills) AS REAL) /
           COALESCE(NULLIF(SUM(CASE WHEN gulag_deaths <= 1 AND gulag_kills <> 1 THEN gulag_deaths ELSE 0 END +
                               gulag_kills), 0), 1)                                        as gulag_win_rate,
           CAST(AVG(team_survival_time) / 1000 / 60 AS REAL)                               AS team_survival_time_mins,
           CAST(AVG(percent_time_moving) AS REAL)                                          as percent_time_moving,
           CAST(AVG(distance_traveled) AS REAL)                                            AS distance_traveled,
           CAST(AVG(damage_taken) AS REAL)                                                 as damage_taken,
           CAST(AVG(headshots) AS REAL)                                                    as headshots,
           CAST(SUM(CASE WHEN team_placement = 1 THEN 1 ELSE 0 END) AS REAL) * 100 /
           COALESCE(NULLIF(COUNT(1), 0), 1)                                                AS win_percentage,


           CAST(COUNT(CASE WHEN team_placement <= 10 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT gm.match_id), 0)                                          AS overall_top_10_rate,
           CAST(COUNT(CASE WHEN team_placement = 1 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT gm.match_id), 0)                                          AS overall_win_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'duo' AND team_placement = 1 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT CASE WHEN gm.team_type = 'solo' THEN gm.match_id END), 0)    AS solo_win_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'duo' AND team_placement = 1 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT CASE WHEN gm.team_type = 'duo' THEN gm.match_id END), 0)     AS duo_win_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'trio' AND team_placement = 1 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT CASE WHEN gm.team_type = 'trio' THEN gm.match_id END), 0)    AS trio_win_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'quad' AND team_placement = 1 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT CASE WHEN gm.team_type = 'quad' THEN gm.match_id END), 0)    AS quad_win_rate,


           AVG(CASE WHEN gm.team_type = 'solo' THEN gm.team_placement END)                    AS avg_solo_placement,
           AVG(CASE WHEN gm.team_type = 'duo' THEN gm.team_placement END)                     AS avg_duo_placement,
           AVG(CASE WHEN gm.team_type = 'trio' THEN gm.team_placement END)                    AS avg_trio_placement,
           AVG(CASE WHEN gm.team_type = 'quad' THEN gm.team_placement END)                    AS avg_quad_placement,


           count(CASE WHEN gm.team_type = 'solo' THEN gm.match_id end)                        as solo_match_count,
           count(CASE WHEN gm.team_type = 'duo' THEN gm.match_id end)                         as duo_match_count,
           count(CASE WHEN gm.team_type = 'trio' THEN gm.match_id end)                        as trio_match_count,
           count(CASE WHEN gm.team_type = 'quad' THEN gm.match_id end)                        as quad_match_count,


           count(CASE WHEN gm.team_type = 'solo' AND team_placement = 1 then gm.match_id END) AS solo_wins,
           count(CASE WHEN gm.team_type = 'duo' AND team_placement = 1 then gm.match_id END)  AS duo_wins,
           count(CASE WHEN gm.team_type = 'trio' AND team_placement = 1 then gm.match_id END) AS trio_wins,
           count(CASE WHEN gm.team_type = 'quad' AND team_placement = 1 then gm.match_id END) AS quad_wins,


           CAST(COUNT(CASE WHEN gm.team_type = 'solo' AND team_placement <= 10 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'solo' then gm.match_id END)), 0)  AS solo_top_10_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'duo' AND team_placement <= 10 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'duo' then gm.match_id END)), 0)   AS duo_top_10_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'trio' AND team_placement <= 10 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'trio' then gm.match_id END)), 0)  AS trio_top_10_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'quad' AND team_placement <= 10 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'quad' then gm.match_id END)), 0)  AS quad_top_10_rate,


           CAST(COUNT(CASE WHEN gm.team_type = 'solo' AND team_placement <= 15 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'solo' then gm.match_id END)), 0)  AS solo_top_10_percent_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'duo' AND team_placement <= 8 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'duo' then gm.match_id END)), 0)   AS duo_top_10_percent_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'trio' AND team_placement <= 5 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'trio' then gm.match_id END)), 0)  AS trio_top_10_percent_rate,
           CAST(COUNT(CASE WHEN gm.team_type = 'quad' AND team_placement <= 4 THEN gm.match_id END) AS REAL) /
           NULLIF(COUNT(DISTINCT (case when gm.team_type = 'quad' then gm.match_id END)), 0)  AS quad_top_10_percent_rate,


           CAST(MAX(CASE WHEN gm.team_type = 'solo' THEN kills END) AS INTEGER)               AS solo_max_kills,
           CAST(MAX(CASE WHEN gm.team_type = 'duo' THEN kills END) AS INTEGER)                AS duo_max_kills,
           CAST(MAX(CASE WHEN gm.team_type = 'trio' THEN kills END) AS INTEGER)               AS trio_max_kills,
           CAST(MAX(CASE WHEN gm.team_type = 'quad' THEN kills END) AS INTEGER)               AS quad_max_kills,

           COUNT(1)                                                                        AS num_matches,
           MAX(gm.end_timestamp)                                                              AS last_match_timestamp,
           CAST((EXTRACT(EPOCH FROM NOW()) - EXTRACT(EPOCH FROM max(gm.end_timestamp)))/(3600*24)  AS INTEGER)        AS days_since_last_match,

           AVG(average_player_kdr) AS average_lobby_kdr,
           AVG(CASE WHEN  gm.team_type = 'solo' THEN average_player_kdr END) AS average_solo_lobby_kdr,
           AVG(CASE WHEN  gm.team_type = 'duo' THEN average_player_kdr END) AS average_duo_lobby_kdr,
           AVG(CASE WHEN  gm.team_type = 'trio' THEN average_player_kdr END) AS average_trio_lobby_kdr,
           AVG(CASE WHEN  gm.team_type = 'quad' THEN average_player_kdr END) AS average_quad_lobby_kdr,

           AVG(average_player_skill_score) AS average_lobby_skill_score,
           AVG(CASE WHEN  gm.team_type = 'solo' THEN average_player_skill_score END) AS average_solo_lobby_skill_score,
           AVG(CASE WHEN  gm.team_type = 'duo' THEN average_player_skill_score END) AS average_duo_lobby_skill_score,
           AVG(CASE WHEN  gm.team_type = 'trio' THEN average_player_skill_score END) AS average_trio_lobby_skill_score,
           AVG(CASE WHEN  gm.team_type = 'quad' THEN average_player_skill_score END) AS average_quad_lobby_skill_score,

           AVG(average_player_score) AS average_lobby_score,
           AVG(CASE WHEN gm.team_type = 'solo' THEN average_player_score END) AS average_solo_lobby_score,
           AVG(CASE WHEN gm.team_type = 'duo' THEN average_player_score END) AS average_duo_lobby_score,
           AVG(CASE WHEN gm.team_type = 'trio' THEN average_player_score END) AS average_trio_lobby_score,
           AVG(CASE WHEN gm.team_type = 'quad' THEN average_player_score END) AS average_quad_lobby_score

    FROM warzone.gamer_matches gm
              JOIN warzone.gamers g ON gm.uno_id = g.uno_id
              LEFT JOIN warzone.matches m ON gm.match_id = m.match_id AND m.game_category = 'Warzone'
    GROUP BY gm.game_category, gm.uno_id
),

 gamer_rolling AS (
     SELECT *
     FROm warzone.gamer_rolling_trends
     WHERE is_latest_game = TRUE
 )


SELECT a.*,
       COALESCE(ghr.heat_rating, 0)                                                            AS heat_rating,
       COALESCE(ghr.last_10_rolling_average_kdr, a.kdr)                                        as last_10_rolling_average_kdr,
       COALESCE(ghr.last_30_rolling_average_kdr, a.kdr)                                        AS last_30_rolling_average_kdr,
       COALESCE(ghr.last_100_rolling_average_kdr, a.kdr)                                       AS last_100_rolling_average_kdr,

       COALESCE(ghr.last_100_solo_rolling_average_kdr, a.kdr)                                  AS last_100_solo_rolling_average_kdr,
       COALESCE(ghr.last_100_duo_rolling_average_kdr, a.kdr)                                   AS last_100_duo_rolling_average_kdr,
       COALESCE(ghr.last_100_trio_rolling_average_kdr, a.kdr)                                  AS last_100_trio_rolling_average_kdr,
       COALESCE(ghr.last_100_quad_rolling_average_kdr, a.kdr)                                  AS last_100_quad_rolling_average_kdr,

       COALESCE(ghr.last_10_rolling_average_kadr, a.kdr)                                       as last_10_rolling_average_kadr,
       COALESCE(ghr.last_30_rolling_average_kadr, a.kdr)                                       AS last_30_rolling_average_kadr,
       COALESCE(ghr.last_100_rolling_average_kadr, a.kdr)                                      AS last_100_rolling_average_kadr,
       COALESCE(ghr.last_100_rolling_average_gulag_kdr, a.kdr)                                 AS last_100_rolling_average_gulag_kdr,
       CONCAT(a.username, '-', a.platform)                                                     as platform_username,
       case when days_since_last_match > 30 then 0 else COALESCE(ghr.heat_index_10_100, 0) end as heat_score
FROM agg a
         LEFT JOIN gamer_rolling ghr
                   ON a.uno_id = ghr.uno_id
                       AND a.game_category = ghr.game_category
    )