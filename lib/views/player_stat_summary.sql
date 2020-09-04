CREATE VIEW player_stat_summary AS

SELECT query_username AS username,
        ARRAY_AGG(username) AS aliases,
       MAX(kills) as max_kills,
       MAX(deaths) as max_deaths,
       MAX(damage_done) AS max_damage_done,
       MAX(damage_taken) AS max_damage_taken,
       AVG(kills) as avg_kills,
       AVG(deaths) as avg_deaths,
       AVG(damage_done) as avg_damage_done,
       AVG(damage_taken) AS avg_damage_taken,
       SUM(damage_done) AS total_damage_done,
       SUM(damage_taken) AS total_damage_taken,
       SUM(kills) as total_kills,
       SUM(deaths) as total_deaths,
       CAST(SUM(kills) AS REAL)/SUM(deaths) as KDR,
       CAST(SUM(gulag_kills) AS REAL)/SUM( CASE WHEN gulag_deaths <= 1 THEN gulag_deaths END + gulag_kills) as gulag_win_rate
FROM gamer_matches
GROUP BY username;
