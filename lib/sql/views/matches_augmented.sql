create OR REPLACE view warzone.matches_augmented AS SELECT match_id,
           start_time,
           end_time,
           map,
           mode,
           duration,
           version,
           game_type,
           player_count,
           team_count,
           to_timestamp(start_time::double precision) AS start_timestamp,
           to_timestamp(end_time::double precision)   AS end_timestamp,
           CASE
               WHEN mode LIKE '%trio%' THEN 'trio'
               WHEN mode like '%duo%' THEN 'duo'
               WHEN mode like '%quad%' THEN 'quad'
               WHEN mode LIKE '%solo%' THEN 'solo'
               ELSE
                   CASE
                       WHEN team_count > 100 THEN 'solo'::text
                       WHEN team_count > 60 THEN 'duo'::text
                       WHEN team_count > 45 THEN 'trio'::text
                       WHEN team_count <= 45 AND team_count >= 30 THEN 'quad'::text
                       ELSE NULL::text
                       END
               END                                    AS team_type,
           CASE
               WHEN mode LIKE '%plnd%' OR
                    mode LIKE '%plun%' OR
                    mode like '%pln%' OR
                    mode like '%bldmny%' THEN 'Plunder'
               WHEN mode LIKE '%jugg%' THEN 'Juggernaut Royale'
               WHEN mode LIKE '%rmbl%' THEN 'Warzone Rumble'
               WHEN mode LIKE '%mini%' THEN 'Mini Royale'
               WHEN mode LIKE '%kingslayer%' THEN 'King Slayer'
               WHEN mode LIKE '%stim%' OR MODE LIKE '%brbb%' THEN 'Buy Back'
               WHEN mode like '%rebirth%' THEN 'Resurgence'
               WHEN mode LIKE '%truckwar%' THEN 'Truck War'
               WHEN mode LIKE '%zmbroy%' THEN 'Zombie Royale'
               ELSE 'Warzone'
               END                                    as game_category
    FROM warzone.matches