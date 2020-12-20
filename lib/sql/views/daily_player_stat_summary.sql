create or replace view warzone.daily_player_stat_summary AS
    SELECT
       date_trunc('day'::text, to_timestamp(m.start_time::double precision)) AS game_day,
       COALESCE(m.game_category, '(all)') as game_category,
       gm.query_username as username,
       gm.query_platform as platform,
       COUNT(DISTINCT gm.match_id) AS num_matches,
       COUNT(CASE WHEN gm.team_placement <= 10 THEN 1 END) AS num_top_ten,
       COUNT(CASE WHEN gm.team_placement <= 3 THEN 1 END) AS num_top_three,
       COUNT(CASE WHEN gm.team_placement = 1 THEN 1 END) AS num_wins,
       AVG(CAST(objective->>'down_enemy_circle_1' AS INTEGER)) as down_enemy_circle_1,
       AVG(CAST(objective->>'caches_open' AS INTEGER)) as caches_open,
       AVG(CAST(objective->>'missions_started' AS INTEGER)) as missions_started,
       AVG(CAST(objective->>'teams_wiped' AS INTEGER)) as teams_wiped,
       AVG(damage_taken) as damage_taken,
       AVG(headshots) as headshots,
       AVG(team_survival_time)/1000/60 AS team_survival_time_mins,
       AVG(percent_time_moving) as percent_time_moving,
       AVG(distance_traveled) AS distance_traveled,
       SUM(gm.kills)                                                           AS total_kills,
       SUM(gm.deaths)                                                          AS total_deaths,
       SUM(gm.damage_done)                                                     AS total_damage_done,
       avg(gm.kills)                                                           AS kills,
       avg(gm.deaths)                                                          AS deaths,
       avg(gm.damage_done)                                                     AS damage_done,
       sum(gm.kills)::real / sum(gm.deaths)::double precision                  AS kdr,
       sum(gm.gulag_kills)::real / COALESCE(NULLIF(sum(
                   CASE
                       WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths
                       ELSE NULL::integer
                       END + gm.gulag_kills), 0), 1)::double precision                 AS gulag_win_rate
FROM warzone.gamer_matches gm
         JOIN warzone.matches_augmented m ON gm.match_id = m.match_id
GROUP BY GROUPING SETS (
    (m.game_category, date_trunc('day'::text, to_timestamp(m.start_time::double precision)), gm.query_username, gm.query_platform),
    (date_trunc('day'::text, to_timestamp(m.start_time::double precision)), gm.query_username, gm.query_platform)
)
ORDER BY gm.query_username, gm.query_platform,
         (date_trunc('day'::text, to_timestamp(m.start_time::double precision)));


