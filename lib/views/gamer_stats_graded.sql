CREATE VIEW warzone.gamer_stats_graded AS
SELECT
   gm.query_username,
       gm.query_platform,
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
    FROM warzone.gamer_matches gm
        JOIN warzone.matches_augmented m on m.match_id = gm.match_id
        , warzone.grading_table gt

    WHERE mode NOT LIKE '%plnd%' AND mode NOT LIKE '%jugg&'  AND mode NOT LIKE '%rmbl%'  AND mode NOT LIKE '%mini%' and mode NOT LIKE '%kingslayer%'
      AND mode NOT LIKE '%dmz%'
 GROUP BY 1,2