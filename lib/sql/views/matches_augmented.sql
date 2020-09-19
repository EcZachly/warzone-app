create view warzone.matches_augmented(match_id, start_time, end_time, map, mode, duration, version, game_type, player_count, team_count, start_timestamp, end_timestamp, team_type) as
SELECT matches.match_id,
       matches.start_time,
       matches.end_time,
       matches.map,
       matches.mode,
       matches.duration,
       matches.version,
       matches.game_type,
       matches.player_count,
       matches.team_count,
       to_timestamp(matches.start_time::double precision) AS start_timestamp,
       to_timestamp(matches.end_time::double precision)   AS end_timestamp,
       CASE
           WHEN matches.team_count > 100 THEN 'solo'::text
           WHEN matches.team_count > 60 THEN 'duo'::text
           WHEN matches.team_count > 45 THEN 'trio'::text
           WHEN matches.team_count <= 45 AND matches.team_count >= 30 THEN 'quad'::text
           ELSE NULL::text
           END                                            AS team_type,
       CASE WHEN mode NOT LIKE '%plnd%' AND mode NOT LIKE '%jugg&'  AND mode NOT LIKE '%rmbl%'  AND mode NOT LIKE '%mini%' and mode NOT LIKE '%kingslayer%'
                 AND mode NOT LIKE '%dmz%' THEN TRUE ELSE FALSE END as is_warzone_match
FROM warzone.matches;