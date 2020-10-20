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
           AVG(headshots) as headshots
    FROM warzone.gamer_matches gm
             JOIN warzone.matches_augmented m
                  ON gm.match_id = m.match_id AND m.is_warzone_match = TRUE
    GROUP BY gm.query_username, gm.query_platform

)


SELECT a.*,
       COALESCE(gsh.num_hits, 0)         AS num_site_hits,
       COALESCE(gsh.num_distinct_users, 0) AS num_distinct_viewing_users,
           CASE
                    WHEN distance_traveled >= g2.nomad THEN 'nomad'
                    WHEN distance_traveled >= g2.traveller THEN 'traveller'
                    WHEN distance_traveled >= g2.wanderer THEN 'wanderer'
                  ELSE 'camper'
               END as distance_class,
               CASE
                   WHEN percent_time_moving >= g2.hummingbird THEN 'hummingbird'
                   WHEN percent_time_moving >= g2.dancer THEN 'dancer'
                   WHEN percent_time_moving >= g2.slug THEN 'slug'
                   ELSE 'statue'
               END as movement_class,
               CASE
                   WHEN down_enemy_circle_1>= g2.warmonger THEN 'warmonger'
                    WHEN down_enemy_circle_1 >= g2.aggressor THEN 'aggressor'
                     WHEN down_enemy_circle_1 >= g2.peacemaker THEN 'peacemaker'

                     ELSE 'pacifist'
               END as aggressiveness_class,
                 CASE
                   WHEN caches_open >= g2.tomb_raider THEN 'tomb_raider'
                   WHEN caches_open >= g2.pirate THEN 'pirate'
                     WHEN caches_open >= g2.scavenger THEN 'scavenger'
                     ELSE 'looter'
               END as looting_class,
                     CASE
                   WHEN missions_started >= g2.secret_agent THEN 'secret_agent'
                       WHEN missions_started >= g2.seal THEN 'seal'
                     WHEN missions_started >= g2.field_agent THEN 'field_agent'

                     ELSE 'intern'
               END as mission_class,
                      CASE
                           WHEN teams_wiped >= g2.conqueror THEN 'conqueror'
                             WHEN teams_wiped >= g2.vanquisher THEN 'vanquisher'
                             ELSE 'surrenderer'
                       END as team_wipe_class,

                                 CASE
                                           WHEN headshots >= g2.headshot_hacker THEN 'headshot_hacker'
                                             WHEN headshots >= g2.deadeye THEN 'deadeye'
                                             ELSE 'trainee'
                                       END as headshot_class,

               CASE
                       WHEN damage_taken >= g2.hospital_patient THEN 'hospital_patient'
                         WHEN damage_taken >= g2.bullet_sponge THEN 'bullet_sponge'
                         WHEN damage_taken >= g2.scratched THEN 'scratched'

                         ELSE 'uninjured'
                   END as damage_taken_class,

                           CASE
                                   WHEN team_survival_time >= g2.tortoise THEN 'tortoise'
                                         WHEN team_survival_time >= g2.elephant THEN 'elephant'
                                     WHEN team_survival_time >= g2.lemming THEN 'lemming'

                                     ELSE 'goldfish'
                               END as survival_time_class


FROM agg a
        LEFT JOIN warzone.gamer_site_hits gsh
              ON a.username = gsh.username AND a.platform = gsh.platform
        LEFT JOIN warzone.gamer_classes_avg g2  ON 1=1
 ORDER BY  COALESCE(gsh.num_hits, 0)   DESC
);
