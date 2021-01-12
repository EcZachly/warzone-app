CREATE OR REPLACE view warzone.player_stat_summary as
(

WITH agg AS (
    SELECT COALESCE(m.game_category, '(all)')                                      AS game_category,
           query_username                                                          AS username,
           query_platform                                                          AS platform,
           ARRAY_AGG(DISTINCT gm.username)                                            AS aliases,
           CAST(MAX(kills) AS INTEGER)                                             AS max_kills,
           CAST(MAX(deaths) AS INTEGER)                                            as max_deaths,
           CAST(MAX(damage_done) AS INTEGER)                                       AS max_damage_done,
           CAST(MAX(damage_taken) AS INTEGER)                                      AS max_damage_taken,
           CAST(AVG(kills) AS REAL)                                                as avg_kills,
           CAST(AVG(deaths) AS REAL)                                               as avg_deaths,
           CAST(AVG(damage_done) AS REAL)                                          as avg_damage_done,
           CAST(AVG(damage_taken) AS REAL)                                         AS avg_damage_taken,
           CAST(SUM(damage_done) AS INTEGER)                                       AS total_damage_done,
           CAST(SUM(damage_taken) AS INTEGER)                                      AS total_damage_taken,
           CAST(SUM(kills) AS INTEGER)                                             as total_kills,
           CAST(SUM(deaths) AS INTEGER)                                            as total_deaths,
           CAST(SUM(kills) AS REAL) / COALESCE(NULLIF(SUM(deaths), 0), 1)          as KDR,

           CAST(SUM(gulag_kills) AS REAL) /
           COALESCE(NULLIF(SUM(CASE WHEN gulag_deaths <= 1 AND gulag_kills <> 1 THEN gulag_deaths ELSE 0 END +
                               gulag_kills), 0), 1)                                as gulag_win_rate,
           CAST(AVG(team_survival_time) / 1000 / 60 AS REAL)                       AS team_survival_time_mins,
           CAST(AVG(percent_time_moving) AS REAL)                                  as percent_time_moving,
           CAST(AVG(distance_traveled) AS REAL)                                    AS distance_traveled,
           CAST(AVG(CAST(objective ->> 'down_enemy_circle_1' AS INTEGER)) AS REAL) as down_enemy_circle_1,
           CAST(AVG(CAST(objective ->> 'caches_open' AS INTEGER)) AS REAL)         as caches_open,
           CAST(AVG(CAST(objective ->> 'missions_started' AS INTEGER)) AS REAL)    as missions_started,
           CAST(AVG(CAST(objective ->> 'teams_wiped' AS INTEGER)) AS REAL)         as teams_wiped,
           CAST(AVG(damage_taken) AS REAL)                                         as damage_taken,
           CAST(AVG(headshots) AS REAL)                                            as headshots,
           CAST(SUM(CASE WHEN team_placement = 1 THEN 1 ELSE 0 END) AS REAL) * 100 /
           COALESCE(NULLIF(COUNT(DISTINCT gm.match_id), 0), 1)                     AS win_percentage,
           COUNT(DISTINCT gm.match_id)                                              AS num_matches

    FROM  warzone.gamer_matches gm
          JOIN warzone.matches_augmented m ON gm.match_id = m.match_id
    GROUP BY GROUPING SETS ( (m.game_category, gm.query_username, gm.query_platform),
                             (gm.query_username, gm.query_platform)
        )
)


SELECT a.*,
       CAST(COALESCE(gsh.num_hits, 0) AS INTEGER)           AS num_site_hits,
       CAST(COALESCE(gsh.num_distinct_users, 0) AS INTEGER) AS num_distinct_viewing_users,
       ghr.heat_rating,
       ghr.last_10_rolling_average_kdr,
       ghr.last_30_rolling_average_kdr,
       ghr.last_100_rolling_average_kdr,
       concat(a.username, '-', a.platform)                  as platform_username
FROM agg a
         LEFT JOIN warzone.gamer_site_hits gsh
                   ON a.username = gsh.username AND a.platform = gsh.platform
         LEFT JOIN warzone.gamer_heat_ratings ghr
                   ON a.username = ghr.query_username
                   AND a.platform = ghr.query_platform
                   AND ghr.game_category = a.game_category
ORDER BY COALESCE(gsh.num_hits, 0) DESC
    );