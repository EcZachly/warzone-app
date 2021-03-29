CREATE OR REPLACE VIEW warzone.match_level_player_stat_summary_last_3_months AS
  SELECT match_id,
       COUNT(skill_score) as num_scores,
       AVG(skill_score) AS average_player_skill_score,
       AVG(kdr) AS average_player_kdr,
       AVG(avg_score) AS average_player_score
    FROM warzone.gamer_matches gm
    JOIN warzone.all_warzone_gamer_stat_summary_last_3_months us
        ON gm.uno_id = us.uno_id
        AND gm.team_type = us.team_type
   WHERE gm.game_category = 'Warzone'
          AND gm.start_timestamp > NOW() - INTERVAL '3 months'
  GROUP BY match_id
  HAVING COUNT(skill_score) > 100