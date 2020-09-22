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
           CAST(SUM(kills) AS REAL) / SUM(deaths)                                                                as KDR,
           CAST(SUM(gulag_kills) AS REAL) /
           SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills)                                  as gulag_win_rate
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
