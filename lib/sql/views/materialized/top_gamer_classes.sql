CREATE MATERIALIZED VIEW warzone.top_gamer_classes AS

SELECT
       username,
       platform,
       json_object_agg(category,  COALESCE(looting_class, distance_class, movement_class, aggressiveness_class, headshot_class, team_wipe_class, mission_class, damage_taken_class) ) as gamer_class_object
FROM warzone.gamer_class_aggregation WHERE class_rank = 1
GROUP BY username, platform;