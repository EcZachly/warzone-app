SELECT
           uno_id,
           team_type,
           MAX(query_platform) as query_platform,
           MAX(query_username) AS query_username,
           COUNT(match_id)                                                                  AS num_matches,
           SUM(kills)                                                                       AS num_kills,
           COALESCE(AVG(score), 0)                                                          AS average_player_score,
           AVG(team_placement)                                                              AS avg_placement,
           CAST(SUM(kills) AS REAL) / CASE WHEN SUM(deaths) = 0 THEN 1 ELSE SUM(deaths) END as average_player_kdr,

--          So the skill score adds up to 300, 100 points for KDR, 50 points for score and 150 points for placement
--          To get all 100 points for KDR, you have to average a 2 KDR or better
--          To get all 50 points for score, you have to average 10000 score or better
           CASE
               WHEN
                           CAST(SUM(kills) AS REAL) / CASE WHEN SUM(deaths) = 0 THEN 1 ELSE SUM(deaths) END > 2 THEN 100
               ELSE
                           CAST(SUM(kills) AS REAL) / CASE WHEN SUM(deaths) = 0 THEN 1 ELSE SUM(deaths) END * 50
               END
               +
           CASE
               WHEN AVG(score) > 10000 THEN 50
               ELSE AVG(score) / 200 END
               +
           151 - AVG(team_placement)                                                        AS average_player_skill_score
    FROM warzone.gamer_matches
    WHERE start_timestamp BETWEEN  TO_DATE($1, 'YYYY-MM-DD') - INTERVAL $2  AND TO_DATE($1, 'YYYY-MM-DD') + INTERVAL '1 day'
      AND game_category = 'Warzone'
    GROUP BY  uno_id,
              team_type