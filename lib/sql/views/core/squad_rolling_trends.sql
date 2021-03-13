CREATE OR REPLACE VIEW warzone.squad_rolling_trends AS
SELECT
      query_username,
      query_platform,
      username,
      start_timestamp,
      team_type,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY gm.start_timestamp ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_placement,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY gm.start_timestamp ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_placement,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY gm.start_timestamp ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_placement,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_kills,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_kills,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_kills,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 10 PRECEDING AND CURRENT ROW ) AS last_10_rolling_average_deaths,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 30 PRECEDING AND CURRENT ROW ) AS last_30_rolling_average_deaths,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN 100 PRECEDING AND CURRENT ROW ) AS last_100_rolling_average_deaths,
      AVG(team_placement) OVER(PARTITION BY query_platform, query_username, team_type ORDER BY gm.start_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS since_start_rolling_average_placement,
      AVG(kills) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS since_start_rolling_average_kills,
      AVG(deaths) OVER(PARTITION BY query_platform, query_username ORDER BY gm.start_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as since_start_rolling_average_deaths
FROM warzone.gamer_matches gm
ORDER BY start_timestamp DESC