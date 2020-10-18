CREATE OR REPLACE VIEW warzone.gamer_class_aggregation AS
WITH agg AS (
    SELECT query_username as username,
       query_platform as platform,
       looting_class,
       movement_class,
       distance_class,
       aggressiveness_class,
       headshot_class,
       team_wipe_class,
       mission_class,
       damage_taken_class,
       GROUPING(looting_class) as looting_class_grouping,
       GROUPING(movement_class) AS movement_class_grouping,
       GROUPING(distance_class) AS distance_class_grouping,
       GROUPING(aggressiveness_class) AS aggressiveness_class_grouping,
       GROUPING(headshot_class) AS headshot_class_grouping,
       GROUPING(team_wipe_class) AS team_wipe_class_grouping,
       GROUPING(mission_class) AS mission_class_grouping,
       GROUPING(damage_taken_class) AS damage_taken_class_grouping,
       COUNT(DISTINCT match_id) as num_matches,
       CAST(SUM(kills) AS REAL)/CASE WHEN SUM(deaths) = 0 THEN 1 ELSE SUM(deaths) END as kdr,
       AVG(team_placement) AS avg_placement
FROM warzone.gamer_matches_augmented
GROUP BY GROUPING SETS ( (query_username, query_platform, looting_class),
                         (query_username, query_platform, movement_class),
                         (query_username, query_platform, distance_class),
                         (query_username, query_platform, aggressiveness_class),
                         (query_username, query_platform, headshot_class),
                         (query_username, query_platform, team_wipe_class),
                         (query_username, query_platform, mission_class),
                         (query_username, query_platform, damage_taken_class)
    )
),
categories AS (
SELECT *, CASE
                WHEN looting_class_grouping = 0 THEN 'looting'
     WHEN movement_class_grouping = 0 THEN 'movement'
     WHEN distance_class_grouping = 0 THEN 'distance'
     WHEN aggressiveness_class_grouping = 0 THEN 'aggressiveness'
     WHEN headshot_class_grouping = 0 THEN 'headshots'
     WHEN team_wipe_class_grouping = 0 THEN 'team_wipe'
        WHEN mission_class_grouping = 0 THEN 'mission'
        WHEN damage_taken_class_grouping = 0 THEN 'damage_taken'
          END as category
FROM agg
)

SELECT *, RANK() OVER(PARTITION BY category, username, platform ORDER BY num_matches DESC) as class_rank
FROM categories
