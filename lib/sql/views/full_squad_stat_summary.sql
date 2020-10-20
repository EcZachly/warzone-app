CREATE OR REPLACE VIEW warzone.full_squad_stat_summary AS
WITH team_cnt AS (
    SELECT
           gm.match_id,
           gm.team,
           m.team_type,
           ARRAY_AGG( gm.query_platform || '-' || gm.query_username ORDER BY gm.query_username) AS username_list,
       COUNT(1)  AS num_players
    FROM warzone.gamer_matches gm
    JOIN warzone.matches_augmented m ON gm.match_id = m.match_id
    WHERE m.is_warzone_match = TRUE
    GROUP BY 1,2,3
),
     full_teams AS (
           SELECT
            match_id,
            team_type,
            CASE

                WHEN team_type = 'duo' and num_players = 2 THEN TRUE
                WHEN team_type = 'trio' and num_players = 3 THEN TRUE
                WHEN team_type = 'quad' and num_players = 4 then TRUE
                ELSE FALSE
            END as has_full_team_data,
            ARRAY_TO_STRING(username_list, '+') as team_grain
         FROM team_cnt
     )

SELECT team_grain,
       m.team_type,
       ARRAY_AGG(DISTINCT  gm.query_platform || '-' || gm.query_username) AS gamers,
       CAST(COUNT(DISTINCT ft.match_id) AS REAL) AS num_matches,
       CAST(SUM(kills) AS REAL) AS total_kills,
       CAST(SUM(deaths) AS REAL) AS total_deaths,
       CAST(SUM(kills) AS REAL)/NULLIF(SUM(deaths), 0) AS kdr,
       CAST(SUM(kills) AS REAL)/COUNT(DISTINCT ft.match_id) AS kills_per_game,
       CAST(SUM(kills) AS REAL)/COUNT(DISTINCT ft.match_id)/COUNT(DISTINCT gm.query_username || '-' || gm.query_platform) AS kills_per_person_per_game,
       CAST(SUM(score) AS REAL)/COUNT(DISTINCT ft.match_id) AS score_per_game,
       CAST(SUM(score) AS REAL)/COUNT(DISTINCT ft.match_id)/COUNT(DISTINCT gm.query_username || '-' || gm.query_platform) AS score_per_person_per_game,
       CAST(SUM(CAST(objective->>'teams_wiped' AS INT)) AS REAL) AS teams_wiped,
       CAST(SUM(CAST(objective->>'teams_wiped' AS INT)) AS REAL)/COUNT(DISTINCT ft.match_id) AS teams_wiped_per_game,
       CAST(SUM(CAST(objective->>'caches_open' AS INT)) AS REAL) AS caches_opened,
       CAST(SUM(CAST(objective->>'caches_open' AS INT)) AS REAL)/COUNT(DISTINCT ft.match_id) AS caches_opened_per_game,
       CAST(AVG(team_placement) AS REAL) AS avg_placement,
       CAST(CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL)/COUNT(DISTINCT ft.match_id) AS REAL) AS win_percentage,
       CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL) as total_wins,
       AVG(percent_time_moving) AS avg_pct_time_moving,
       AVG(distance_traveled) AS avg_distance_traveled,
       CAST(SUM(headshots) AS REAL) AS total_headshots,
       CAST(SUM(headshots) AS REAL)/COUNT(DISTINCT ft.match_id) AS headshots_per_game,
       CAST(SUM(gulag_kills) AS REAL) /
       NULLIF(SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills), 0)                              as gulag_win_rate
FROM full_teams ft
    JOIN warzone.gamer_matches gm ON ft.match_id = gm.match_id
       JOIN warzone.matches_augmented m ON ft.match_id = m.match_id
WHERE has_full_team_data = TRUE
GROUP BY 1,2
ORDER BY    CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL)  DESC
