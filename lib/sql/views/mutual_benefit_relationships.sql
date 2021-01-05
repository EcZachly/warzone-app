CREATE OR REPLACE VIEW warzone.mutual_benefit_relationships AS

WITH overall AS (
    SELECT *
    FROM warzone.teammate_analysis
    WHERE helping_player = '(overall)'
      AND helping_player_platform = '(overall)'
),
     not_overall AS (
          SELECT *
          FROM warzone.teammate_analysis
          WHERE helping_player NOT IN ('(overall)', 'without teammates')
          AND helping_player_platform NOT IN ('(overall)', 'without teammates')
     ),
     kdr_improve_edges AS (
         SELECT no.game_category, no.num_matches, no.username, no.platform, no.helping_player, no.helping_player_platform, FALSE as lower_is_better, 'kdr' as relationship_stat, 'improves kdr' as relationship_type,  no.kdr as stat_with_player, o.kdr as overall_stat, no.kdr/o.kdr as ratio
            FROM not_overall no
                    join overall o
        ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category
     ),
      duo_improve_edges AS (
         SELECT no.game_category, no.num_matches, no.username, no.platform, no.helping_player, no.helping_player_platform, TRUE as lower_is_better, 'duo_placement' as relationship_stat, 'improves duo_placement' as relationship_type,  no.avg_duo_placement as stat_with_player, o.avg_duo_placement as overall_stat, no.avg_duo_placement/o.avg_duo_placement as ratio
            FROM not_overall no
                    join overall o
        ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category
     ),
       trio_improve_edges AS (
         SELECT no.game_category, no.num_matches, no.username, no.platform, no.helping_player, no.helping_player_platform, TRUE as lower_is_better, 'trio_placement' as relationship_stat,  'improves trio_placement' as relationship_type,  no.avg_trio_placement as stat_with_player, o.avg_trio_placement as overall_stat, no.avg_trio_placement/o.avg_trio_placement as ratio
            FROM not_overall no
                    join overall o
        ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category

     ),
      quad_improve_edges AS (
         SELECT no.game_category, no.num_matches, no.username, no.platform, no.helping_player, no.helping_player_platform, TRUE as lower_is_better,'quad_placement' as relationship_stat, 'improves quad_placement' as relationship_type,  no.avg_quad_placement as stat_with_player, o.avg_quad_placement as overall_stat, no.avg_quad_placement/o.avg_quad_placement as ratio
            FROM not_overall no
                    join overall o
        ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category
     ),
      kill_improve_edges AS (
         SELECT no.game_category, no.num_matches, no.username, no.platform, no.helping_player, no.helping_player_platform, FALSE as lower_is_better, 'avg_kills' as relationship_stat, 'improves average kills' as relationship_type, no.avg_kills as stat_with_player, o.avg_kills as overall_stat, no.avg_kills/o.avg_kills as ratio
            FROM not_overall no
                    join overall o
        ON no.username = o.username AND no.platform = o.platform AND no.game_category = o.game_category
     ),
     combined AS (
         SELECT * FROM kdr_improve_edges
            UNION ALL
            SELECT * FROM kill_improve_edges
         UNION ALL
         SELECT * FROM duo_improve_edges
          UNION ALL
           SELECT * FROM trio_improve_edges
         UNION ALL
         SELECT * FROM quad_improve_edges
        )
SELECT c.*, c2.overall_stat as helper_overall_stat, c2.stat_with_player AS helper_stat_with_player, c2.ratio as helper_ratio
FROM combined c
        JOIN combined c2
        ON c.helping_player = c2.username
            AND c.game_category = c2.game_category
               AND c.helping_player_platform = c2.platform
               AND c2.helping_player = c.username
               AND c2.helping_player_platform = c.platform
                AND c.relationship_type = c2.relationship_type



