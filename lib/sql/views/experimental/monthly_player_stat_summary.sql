CREATE VIEW warzone.monthly_player_stat_summary AS

SELECT
       DATE_TRUNC('month', to_timestamp(start_time)) as game_month,
       gm.query_username,
       gm.query_platform,
       AVG(gm.kills) as average_kills,
       AVG(gm.deaths) AS average_deaths,
       AVG(gm.damage_done) AS average_damage_done,
       CAST(SUM(gm.kills) as REAL)/SUM(gm.deaths) AS kdr,
              sum(gm.gulag_kills)::real / sum(
                   CASE
                       WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths
                       ELSE NULL::integer
                       END + gm.gulag_kills)::double precision           AS gulag_win_rate

FROM warzone.gamer_matches gm
    JOIN warzone.matches m ON gm.match_id = m.match_id

GROUP BY 1,2,3
ORDER BY gm.query_username, gm.query_platform, game_month

