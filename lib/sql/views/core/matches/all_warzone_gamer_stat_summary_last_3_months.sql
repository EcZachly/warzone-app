CREATE OR REPLACE VIEW warzone.all_warzone_gamer_stat_summary_last_3_months AS
SELECT
           uno_id,
           team_type,
           MAX(query_platform) as query_platform,
           MAX(query_username) AS query_username,
           COUNT(match_id)                                                                  AS num_matches,
           SUM(kills)                                                                       AS num_kills,
           AVG(score) AS avg_score,
           AVG(team_placement)                                                              AS avg_placement,
           CAST(SUM(kills) AS REAL) / CASE WHEN SUM(deaths) = 0 THEN 1 ELSE SUM(deaths) END as kdr,

--           So the skill score adds up to 300, 100 points for KDR, 50 points for score and 150 points for placement
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
           151 - AVG(team_placement)                                                        AS skill_score


    FROM warzone.gamer_matches
    WHERE start_timestamp BETWEEN  NOW() - INTERVAL '3 months' AND NOW() + interval '1 day'
      AND game_category = 'Warzone'
    GROUP BY query_platform,
                        query_username,
                        uno_id,
                        team_type