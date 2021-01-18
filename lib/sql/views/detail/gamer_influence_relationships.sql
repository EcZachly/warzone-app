CREATE OR REPLACE VIEW warzone.gamer_influence_relationships AS
WITH overall AS (
    SELECT *
    FROM warzone.gamer_stat_summary
),
     not_overall AS (
         SELECT *
         FROM warzone.teammate_analysis
     ),
     a AS (
         SELECT no.game_category,
                no.num_matches,
                no.username,
                no.platform,
                no.helping_player,
                no.helping_player_platform,
                ARRAY [
                    ROW ('kdr', 1, no.kdr, o.kdr, no.kdr / NULLIF(o.kdr, 0), no.helper_kdr, o2.kdr, no.helper_kdr / NULLIF(o2.kdr, 0), FALSE),
                    ROW ('kills', 2, no.avg_kills, o.avg_kills, no.avg_kills / NULLIF(o.avg_kills, 0), no.avg_helper_kills, o2.avg_kills, no.avg_helper_kills / NULLIF(o2.avg_kills, 0), FALSE),
                    ROW ('gulag_win_rate', 3, no.gulag_win_rate, o.gulag_win_rate, no.gulag_win_rate / NULLIF(o.gulag_win_rate, 0), no.helper_gulag_win_rate, o2.gulag_win_rate, no.helper_gulag_win_rate / NULLIF(o2.gulag_win_rate, 0), FALSE),


                    ROW ('overall_win_rate', 4, no.overall_win_rate, o.overall_win_rate, no.overall_win_rate / NULLIF(o.overall_win_rate, 0), no.overall_win_rate, o2.overall_win_rate, no.overall_win_rate / NULLIF(o2.overall_win_rate, 0), FALSE),
                    ROW ('overall_top_10_rate', 5, no.overall_top_10_rate, o.overall_top_10_rate, no.overall_top_10_rate / NULLIF(o.overall_top_10_rate, 0), no.overall_top_10_rate, o2.overall_top_10_rate, no.overall_top_10_rate / NULLIF(o2.overall_top_10_rate, 0), FALSE),


                    ROW ('duo_win_rate', 6, no.duo_win_rate, o.duo_win_rate, no.duo_win_rate / NULLIF(o.duo_win_rate, 0), no.duo_win_rate, o2.duo_win_rate, no.duo_win_rate / NULLIF(o2.duo_win_rate, 0), FALSE),
                    ROW ('trio_win_rate', 7, no.trio_win_rate, o.trio_win_rate, no.trio_win_rate / NULLIF(o.trio_win_rate, 0), no.trio_win_rate, o2.trio_win_rate, no.trio_win_rate / NULLIF(o2.trio_win_rate, 0), FALSE),
                    ROW ('quads_win_rate', 8, no.quad_win_rate, o.quad_win_rate, no.quad_win_rate / NULLIF(o.quad_win_rate, 0), no.quad_win_rate, o2.quad_win_rate, no.quad_win_rate / NULLIF(o2.quad_win_rate, 0), FALSE),

                    ROW ('duo_placement', 9, no.avg_duo_placement, o.avg_duo_placement, no.avg_duo_placement / NULLIF(o.avg_duo_placement, 0), no.avg_duo_placement, o2.avg_duo_placement, no.avg_duo_placement / NULLIF(o2.avg_duo_placement, 0), TRUE),
                    ROW ('trio_placement', 10, no.avg_trio_placement, o.avg_trio_placement, no.avg_trio_placement / NULLIF(o.avg_trio_placement, 0), no.avg_trio_placement, o2.avg_trio_placement, no.avg_trio_placement / NULLIF(o2.avg_trio_placement, 0), TRUE),
                    ROW ('quad_placement', 11, no.avg_quad_placement, o.avg_quad_placement, no.avg_quad_placement / NULLIF(o.avg_quad_placement, 0), no.avg_quad_placement, o2.avg_quad_placement, no.avg_quad_placement / NULLIF(o2.avg_quad_placement, 0), TRUE)
                    ]::relationship_edge[] as relationships,
                o.uno_id,
                o2.uno_id as helper_uno_id,
                o.aliases,
                o2.aliases                 as helper_aliases
         FROM not_overall no
                  join overall o
                       ON no.uno_id = o.uno_id AND no.game_category = o.game_category
                  JOIN overall o2
                       ON no.helper_uno_id = o2.uno_id AND no.game_category = o2.game_category
     ),
     unnested AS (
         SELECT *, unnest(relationships) as relations
         FROM a
     )

SELECT no.game_category,
       no.num_matches,
       no.username,
       no.platform,
       no.uno_id,
       no.aliases,
       no.helping_player,
       no.helping_player_platform,
       no.helper_uno_id,
       no.helper_aliases,
       (no.relations).relationship_stat       as relationship_stat,
       (no.relations).relationship_sort       as relationship_sort,
       (no.relations).stat_with_player        as stat_with_player,
       (no.relations).overall_stat            as overall_stat,
       (no.relations).ratio                   as ratio,
       (no.relations).helper_stat_with_player as helper_stat_with_player,
       (no.relations).helper_overall_stat     as helper_overall_stat,
       (no.relations).helper_ratio            as helper_ratio,
       (no.relations).lower_is_better         as lower_is_better
FROM unnested no
ORDER BY num_matches DESC, (no.relations).relationship_sort




