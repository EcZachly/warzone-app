CREATE OR REPLACE VIEW warzone.squad_stat_summary AS
WITH team_cnt AS (
    SELECT
           match_id,
           team,
           team_type,
           ARRAY_AGG( query_platform || '-' || query_username ORDER BY query_username) AS username_list,
           COUNT(DISTINCT query_username )  AS num_players
    FROM warzone.gamer_matches
    GROUP BY 1,2,3
),
     full_teams AS (
           SELECT
            match_id,
            team_type,
            team,
            CASE
                WHEN team_type = 'duo' and num_players = 2 THEN TRUE
                WHEN team_type = 'trio' and num_players = 3 THEN TRUE
                WHEN team_type = 'quad' and num_players = 4 then TRUE
                ELSE FALSE
            END as has_full_team_data,
            ARRAY_TO_STRING(username_list, '+') as team_grain
         FROM team_cnt
     )

SELECT ft.team_grain,
       ft.team_type,
       gm.game_category,
       ARRAY_AGG(DISTINCT  gm.query_platform || '-' || gm.query_username) AS gamers,
       CAST(COUNT(DISTINCT ft.match_id) AS REAL) AS num_matches,
       CAST(SUM(kills) AS REAL) AS total_kills,
       CAST(SUM(deaths) AS REAL) AS total_deaths,
       CAST(SUM(kills) AS REAL)/NULLIF(SUM(deaths), 0) AS kdr,
       CAST(SUM(kills) AS REAL)/COUNT(DISTINCT ft.match_id) AS kills_per_game,
       CAST(SUM(kills) AS REAL)/COUNT(DISTINCT ft.match_id)/COUNT(DISTINCT gm.query_username || '-' || gm.query_platform) AS kills_per_person_per_game,
       CAST(SUM(score) AS REAL)/COUNT(DISTINCT ft.match_id) AS score_per_game,
       CAST(SUM(score) AS REAL)/COUNT(DISTINCT ft.match_id)/COUNT(DISTINCT gm.query_username || '-' || gm.query_platform) AS score_per_person_per_game,
       CAST(SUM(CAST(objective->>'teams_wiped' AS INT)) AS REAL) AS total_teams_wiped,
       CAST(SUM(CAST(objective->>'teams_wiped' AS INT)) AS REAL)/COUNT(DISTINCT ft.match_id) AS teams_wiped,
       CAST(SUM(CAST(objective->>'down_enemy_circle_1' AS INT)) AS REAL)/COUNT(DISTINCT ft.match_id) AS down_enemy_circle_1,
       CAST(AVG(CAST(objective->>'missions_started' AS INT)) AS REAL)  AS missions_started,
       CAST(SUM(CAST(objective->>'caches_open' AS INT)) AS REAL) AS total_caches_opened,
       CAST(SUM(CAST(objective->>'caches_open' AS INT)) AS REAL)/COUNT(DISTINCT ft.match_id) AS caches_opened,
       CAST(SUM(damage_taken) AS REAL)/COUNT(DISTINCT ft.match_id) AS damage_taken,
       CAST(AVG(team_survival_time)/1000/60 AS REAL) AS team_survival_time_mins,
       CAST(AVG(team_placement) AS REAL) AS avg_placement,
       CAST(CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL)*100/COUNT(DISTINCT ft.match_id) AS REAL) AS win_percentage,
       CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL) as total_wins,
       AVG(percent_time_moving) AS percent_time_moving,
       AVG(distance_traveled) AS distance_traveled,
       CAST(SUM(headshots) AS REAL) AS total_headshots,
       CAST(SUM(headshots) AS REAL)/COUNT(DISTINCT ft.match_id) AS headshots,
       CAST(SUM(gulag_kills) AS REAL) /
       NULLIF(SUM(CASE WHEN gulag_deaths <= 1 THEN gulag_deaths ELSE 0 END + gulag_kills), 0)                              as gulag_win_rate
FROM full_teams ft
    JOIN warzone.gamer_matches gm ON ft.match_id = gm.match_id and ft.team = gm.team
WHERE has_full_team_data = TRUE
GROUP BY ft.team_grain, ft.team_type, gm.game_category
ORDER BY  CAST(COUNT(DISTINCT CASE WHEN team_placement = 1 THEN ft.match_id END) AS REAL)  DESC
