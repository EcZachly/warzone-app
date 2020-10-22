CREATE OR REPLACE VIEW warzone.player_stat_summary AS
(

WITH agg AS (
    SELECT query_username                                                                                        AS username,
           query_platform                                                                                        AS platform,
           ARRAY_AGG(DISTINCT username)                                                                          AS aliases,
           MAX(kills)                                                                                            as max_kills,
           MAX(deaths)                                                                                           as max_deaths,
           MAX(damage_done)                                                                                      AS max_damage_done,
           MAX(damage_taken)                                                                                     AS max_damage_taken,
           AVG(kills)                                                                                            as avg_kills,
           AVG(deaths)                                                                                           as avg_deaths,
           AVG(damage_done)                                                                                      as avg_damage_done,
           AVG(damage_taken)                                                                                     AS avg_damage_taken,
           SUM(damage_done)                                                                                      AS total_damage_done,
           SUM(damage_taken)                                                                                     AS total_damage_taken,
           SUM(kills)                                                                                            as total_kills,
           SUM(deaths)                                                                                           as total_deaths,
           CAST(SUM(kills) AS REAL) / NULLIF(SUM(deaths)  , 0)                                                              as KDR,
           CAST(SUM(gulag_kills) AS REAL) /
           NULLIF(SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills)  ,0)                                as gulag_win_rate,
           AVG(team_survival_time) AS team_survival_time,
           AVG(percent_time_moving) as percent_time_moving,
           AVG(distance_traveled) AS distance_traveled,
           AVG(CAST(objective->>'down_enemy_circle_1' AS INTEGER)) as down_enemy_circle_1,
           AVG(CAST(objective->>'caches_open' AS INTEGER)) as caches_open,
           AVG(CAST(objective->>'missions_started' AS INTEGER)) as missions_started,
           AVG(CAST(objective->>'teams_wiped' AS INTEGER)) as teams_wiped,
           AVG(damage_taken) as damage_taken,
           AVG(headshots) as headshots,
           CAST(SUM(CASE WHEN team_placement = 1 THEN 1 ELSE 0 END) AS REAL)/COUNT(DISTINCT gm.match_id)          AS  win_percentage
    FROM warzone.gamer_matches gm
             JOIN warzone.matches_augmented m
                  ON gm.match_id = m.match_id AND m.is_warzone_match = TRUE
    GROUP BY gm.query_username, gm.query_platform

)


SELECT a.*,
       COALESCE(gsh.num_hits, 0)         AS num_site_hits,
       COALESCE(gsh.num_distinct_users, 0) AS num_distinct_viewing_users
FROM agg a
        LEFT JOIN warzone.gamer_site_hits gsh
              ON a.username = gsh.username AND a.platform = gsh.platform
 ORDER BY  COALESCE(gsh.num_hits, 0)   DESC
);
