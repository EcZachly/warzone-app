CREATE OR REPLACE VIEW warzone.mutual_benefit_relationships AS
WITH overall AS (
    SELECT *
    FROM warzone.player_stat_summary
),
     not_overall AS (
         SELECT *
         FROM warzone.teammate_analysis
         WHERE helping_player NOT IN ('without teammates')
           AND helping_player_platform NOT IN ('without teammates')
         AND num_matches >= 5
     ),
     a AS (
         SELECT no.game_category,
                no.num_matches,
                no.username,
                no.platform,
                no.helping_player,
                no.helping_player_platform,
                ARRAY [
                    ROW ('kdr', 'improves kdr', no.kdr, o.kdr, no.kdr / NULLIF(o.kdr, 0), no.helper_kdr, o2.kdr, no.helper_kdr / NULLIF(o2.kdr, 0), FALSE),
                    ROW ('kills', 'improves kills', no.avg_kills, o.avg_kills, no.avg_kills / NULLIF(o.avg_kills, 0), no.avg_helper_kills, o2.avg_kills, no.avg_helper_kills / NULLIF(o2.avg_kills, 0), FALSE),
                    ROW ('duo_placement', 'improves duo placement', no.avg_duo_placement, o.avg_duo_placement, no.avg_duo_placement / NULLIF(o.avg_duo_placement, 0), no.avg_duo_placement, o2.avg_duo_placement, no.avg_duo_placement / NULLIF(o2.avg_duo_placement, 0), TRUE),
                    ROW ('trio_placement', 'improves trio placement', no.avg_trio_placement, o.avg_trio_placement, no.avg_trio_placement / NULLIF(o.avg_trio_placement, 0), no.avg_trio_placement, o2.avg_trio_placement, no.avg_trio_placement / NULLIF(o2.avg_trio_placement, 0), TRUE),
                    ROW ('quad_placement', 'improves quad placement', no.avg_quad_placement, o.avg_quad_placement, no.avg_quad_placement / NULLIF(o.avg_quad_placement, 0), no.avg_quad_placement, o2.avg_quad_placement, no.avg_quad_placement / NULLIF(o2.avg_quad_placement, 0), TRUE)
                    ]::relationship_edge[] as relationships
         FROM not_overall no
                  join overall o
                       ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category
                  JOIN overall o2
                       ON no.helping_player = o2.username AND no.helping_player_platform = o2.platform
                           AND no.game_category = o2.game_category
     ),
     unnested AS (
         SELECT *, UNNEST(relationships) as relations
         FROM a
     )

SELECT no.game_category,
       no.num_matches,
       no.username,
       no.platform,
       no.helping_player,
       no.helping_player_platform,
       (no.relations).relationship_stat       as relationship_stat,
       (no.relations).relationship_type       as relationship_type,
       (no.relations).stat_with_player        as stat_with_player,
       (no.relations).overall_stat            as overall_stat,
       (no.relations).ratio                   as ratio,
       (no.relations).helper_stat_with_player as helper_stat_with_player,
       (no.relations).helper_overall_stat     as helper_overall_stat,
       (no.relations).helper_ratio            as helper_ratio,
       (no.relations).lower_is_better         as lower_is_better
FROM unnested no
ORDER BY num_matches DESC





