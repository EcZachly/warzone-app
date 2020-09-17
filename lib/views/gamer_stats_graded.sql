CREATE OR REPLACE VIEW warzone.gamer_stats_graded AS

    WITH mapped AS (

        SELECT *,
               CAST(kills AS REAL)/CASE WHEN deaths = 0 THEN 1 ELSE deaths END as kdr
               FROM warzone.gamer_matches

    )
SELECT
   gm.query_username,
       gm.query_platform,

        COUNT(CASE WHEN gm.score >= gt.a_grade_score THEN 1 END) AS a_grade_score,
              COUNT(CASE WHEN gm.score < gt.a_grade_score  AND gm.score >= gt.b_grade_score THEN 1 END) AS b_grade_score,
              COUNT(CASE WHEN gm.score < gt.b_grade_score  AND gm.score >= gt.c_grade_score THEN 1 END) AS c_grade_score,
              COUNT(CASE WHEN gm.score < gt.c_grade_score  AND gm.score >= gt.d_grade_score THEN 1 END) AS d_grade_score,
              COUNT(CASE WHEN gm.score < gt.d_grade_score  THEN 1 END) AS f_grade_score,


           COUNT(CASE WHEN gm.kills >= gt.a_grade_kills THEN 1 END) AS a_grade_kills,
              COUNT(CASE WHEN gm.kills < gt.a_grade_kills  AND gm.kills >= gt.b_grade_kills THEN 1 END) AS b_grade_kills,
              COUNT(CASE WHEN gm.kills < gt.b_grade_kills  AND gm.kills >= gt.c_grade_kills THEN 1 END) AS c_grade_kills,
              COUNT(CASE WHEN gm.kills < gt.c_grade_kills  AND gm.kills >= gt.d_grade_kills THEN 1 END) AS d_grade_kills,
              COUNT(CASE WHEN gm.kills < gt.d_grade_kills  THEN 1 END) AS f_grade_kills,


             COUNT(CASE WHEN gm.kdr >= gt.a_grade_kdr THEN 1 END) AS a_grade_kdr,
              COUNT(CASE WHEN gm.kdr < gt.a_grade_kdr  AND gm.kdr >= gt.b_grade_kdr THEN 1 END) AS b_grade_kdr,
              COUNT(CASE WHEN gm.kdr < gt.b_grade_kdr  AND gm.kdr >= gt.c_grade_kdr THEN 1 END) AS c_grade_kdr,
              COUNT(CASE WHEN gm.kdr < gt.c_grade_kdr  AND gm.kdr >= gt.d_grade_kdr THEN 1 END) AS d_grade_kdr,
              COUNT(CASE WHEN gm.kdr < gt.d_grade_kdr THEN 1 END) AS f_grade_kdr,
        COUNT(CASE WHEN m.team_type = 'solo'
                           AND gm.team_placement <= gt.a_grade_solo THEN 1 END) AS a_grade_solo_placements,
       COUNT(CASE WHEN m.team_type = 'solo'
                           AND gm.team_placement > gt.a_grade_solo
                           AND gm.team_placement <= gt.b_grade_solo THEN 1 END) AS b_grade_solo_placements,
       COUNT(CASE WHEN m.team_type = 'solo'
                           AND gm.team_placement > gt.b_grade_solo
                           AND gm.team_placement <= gt.c_grade_solo THEN 1 END) AS c_grade_solo_placements,
        COUNT(CASE WHEN m.team_type = 'solo'
                           AND gm.team_placement > gt.c_grade_solo
                           AND gm.team_placement <= gt.d_grade_solo THEN 1 END) AS d_grade_solo_placements,
        COUNT(CASE WHEN m.team_type = 'solo'
                           AND gm.team_placement > gt.d_grade_solo THEN 1 END) AS f_grade_solo_placements,
       COUNT(CASE WHEN m.team_type = 'duo'
                           AND gm.team_placement <= gt.a_grade_duo THEN 1 END) AS a_grade_duo_placements,
       COUNT(CASE WHEN m.team_type = 'duo'
                           AND gm.team_placement > gt.a_grade_duo
                           AND gm.team_placement <= gt.b_grade_duo THEN 1 END) AS b_grade_duo_placements,
       COUNT(CASE WHEN m.team_type = 'duo'
                           AND gm.team_placement > gt.b_grade_duo
                           AND gm.team_placement <= gt.c_grade_duo THEN 1 END) AS c_grade_duo_placements,
        COUNT(CASE WHEN m.team_type = 'duo'
                           AND gm.team_placement > gt.c_grade_duo
                           AND gm.team_placement <= gt.d_grade_duo THEN 1 END) AS d_grade_duo_placements,
        COUNT(CASE WHEN m.team_type = 'duo'
                           AND gm.team_placement > gt.d_grade_duo THEN 1 END) AS f_grade_duo_placements,

        COUNT(CASE WHEN m.team_type = 'trio'
                           AND gm.team_placement <= gt.a_grade_trio THEN 1 END) AS a_grade_trio_placements,
       COUNT(CASE WHEN m.team_type = 'trio'
                           AND gm.team_placement > gt.a_grade_trio
                           AND gm.team_placement <= gt.b_grade_trio THEN 1 END) AS b_grade_trio_placements,
       COUNT(CASE WHEN m.team_type = 'trio'
                           AND gm.team_placement > gt.b_grade_trio
                           AND gm.team_placement <= gt.c_grade_trio THEN 1 END) AS c_grade_trio_placements,
        COUNT(CASE WHEN m.team_type = 'trio'
                           AND gm.team_placement > gt.c_grade_trio
                           AND gm.team_placement <= gt.d_grade_trio THEN 1 END) AS d_grade_trio_placements,
        COUNT(CASE WHEN m.team_type = 'trio'
                           AND gm.team_placement > gt.d_grade_trio THEN 1 END) AS f_grade_trio_placements,

        COUNT(CASE WHEN m.team_type = 'quad'
                           AND gm.team_placement <= gt.a_grade_quad THEN 1 END) AS a_grade_quad_placements,
       COUNT(CASE WHEN m.team_type = 'quad'
                           AND gm.team_placement > gt.a_grade_quad
                           AND gm.team_placement <= gt.b_grade_quad THEN 1 END) AS b_grade_quad_placements,
       COUNT(CASE WHEN m.team_type = 'quad'
                           AND gm.team_placement > gt.b_grade_quad
                           AND gm.team_placement <= gt.c_grade_quad THEN 1 END) AS c_grade_quad_placements,
        COUNT(CASE WHEN m.team_type = 'quad'
                           AND gm.team_placement > gt.c_grade_quad
                           AND gm.team_placement <= gt.d_grade_quad THEN 1 END) AS d_grade_quad_placements,
        COUNT(CASE WHEN m.team_type = 'quad'
                           AND gm.team_placement > gt.d_grade_quad THEN 1 END) AS f_grade_quad_placements
    FROM mapped gm
        JOIN warzone.matches_augmented m on m.match_id = gm.match_id
        , warzone.grading_table gt

    WHERE mode NOT LIKE '%plnd%' AND mode NOT LIKE '%jugg&'  AND mode NOT LIKE '%rmbl%'  AND mode NOT LIKE '%mini%' and mode NOT LIKE '%kingslayer%'
      AND mode NOT LIKE '%dmz%'
 GROUP BY 1,2