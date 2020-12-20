CREATE VIEW warzone.squad_rolling_trends AS
SELECT
      query_username,
      query_platform,
      username,
      start_timestamp,
      team_type,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_placement,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_placement,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_placement,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_kills,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_kills,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_kills,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_deaths,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_deaths,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_deaths,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS since_start_rolling_average_placement,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS since_start_rolling_average_kills,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY m.start_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as since_start_rolling_average_deaths
FROM warzone.gamer_matches gm
    JOIN warzone.matches_augmented m on m.match_id = gm.match_id
ORDER BY start_timestamp DESC