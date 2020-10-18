CREATE OR REPLACE VIEW warzone.gamer_matches_augmented AS
SELECT
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
            WHEN objective->>'down_enemy_circle_1' >= g2.warmonger THEN 'warmonger'
             WHEN objective->>'down_enemy_circle_1' >= g2.aggressor THEN 'aggressor'
              WHEN objective->>'down_enemy_circle_1' >= g2.peacemaker THEN 'peacemaker'

              ELSE 'pacifist'
        END as aggressiveness_class,
          CASE
            WHEN CAST(objective->>'caches_open' AS INTEGER) >= g2.tomb_raider THEN 'tomb_raider'
            WHEN CAST(objective->>'caches_open' AS INTEGER) >= g2.pirate THEN 'pirate'
              WHEN CAST(objective->>'caches_open' AS INTEGER) >= g2.scavenger THEN 'scavenger'
              ELSE 'looter'
        END as looting_class,
              CASE
            WHEN objective->>'missions_started' >= g2.secret_agent THEN 'secret_agent'
                WHEN objective->>'missions_started' >= g2.seal THEN 'seal'
              WHEN objective->>'missions_started' >= g2.field_agent THEN 'field_agent'

              ELSE 'intern'
        END as mission_class,
               CASE
                    WHEN objective->>'teams_wiped' >= g2.conqueror THEN 'conqueror'
                      WHEN objective->>'teams_wiped' >= g2.vanquisher THEN 'vanquisher'
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
                        END as survival_time_class,

           gm.*,
            m.team_type
        FROM warzone.gamer_matches gm
            JOIN warzone.gamer_classes g2 ON 1=1
            join warzone.matches_augmented m
                ON gm.match_id = m.match_id
                       AND m.is_warzone_match = TRUE

