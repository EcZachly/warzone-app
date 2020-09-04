CREATE OR REPLACE VIEW teammate_analysis AS
WITH source AS (
    SELECT m.start_timestamp,
            gm.*,
            gm.query_username                      AS shooting_player,
            COALESCE(gm2.username, 'without teammates')  AS helping_player
    FROM gamer_matches gm
         LEFT JOIN gamer_matches gm2
                   ON gm.team = gm2.team
                       AND gm.match_id = gm2.match_id
                       AND gm.username <> gm2.username
         JOIN matches_augmented m on gm.match_id = m.match_id

),
     overall AS (
          SELECT
            gm.query_username                      AS shooting_player,
            '(overall)' as helping_player,
                 COUNT(DISTINCT gm.match_id)                                                               AS num_matches,
       COUNT(1)                                                               AS num_rows,
       MIN(start_timestamp)                                                                      AS first_game_time,
       MAX(start_timestamp)                                                                      AS last_game_time,
       SUM(gm.assists)                                                                        AS total_assists,
       AVG(gm.assists)                                                                           AS avg_assists,
       SUM(gm.kills)                                                                       AS num_kills,
       AVG(gm.score)                                                                             AS avg_score,
       AVG(gm.kills)                                                                             AS avg_kills,
       AVG(gm.deaths)                                                                            AS avg_deaths,
       MAX(gm.kills)                                                                             AS max_kills,
       MAX(gm.deaths)                                                                            AS max_deaths,
       AVG(gm.team_placement)                                                                    AS avg_team_placement,
       CAST(SUM(gm.kills) AS real) / CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END AS kdr,
       CAST(SUM(gm.gulag_kills) AS REAL)/SUM( CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths END + gm.gulag_kills) as gulag_win_rate
    FROM gamer_matches gm
          JOIN matches_augmented m on gm.match_id = m.match_id
         GROUP BY shooting_player

     ),
     with_teammates AS (

         SELECT shooting_player                                                                     AS shooting_player,
       helping_player                                   AS helping_player,
       COUNT(DISTINCT gm.match_id)                                                               AS num_matches,
       COUNT(1)                                                               AS num_rows,
       MIN(start_timestamp)                                                                      AS first_game_time,
       MAX(start_timestamp)                                                                      AS last_game_time,
       SUM(gm.assists)                                                                        AS total_assists,
       AVG(gm.assists)                                                                           AS avg_assists,
       SUM(gm.kills)                                                                       AS num_kills,
       AVG(gm.score)                                                                             AS avg_score,
       AVG(gm.kills)                                                                             AS avg_kills,
       AVG(gm.deaths)                                                                            AS avg_deaths,
       MAX(gm.kills)                                                                             AS max_kills,
       MAX(gm.deaths)                                                                            AS max_deaths,
       AVG(gm.team_placement)                                                                    AS avg_team_placement,
       CAST(SUM(gm.kills) AS real) / CASE WHEN SUM(gm.deaths) = 0 THEN 1 ELSE SUM(gm.deaths) END AS kdr,
        CAST(SUM(gm.gulag_kills) AS REAL)/SUM( CASE WHEN gm.gulag_deaths <= 1 THEN gm.gulag_deaths END + gm.gulag_kills) as gulag_win_rate
FROM source gm
GROUP BY shooting_player, helping_player
HAVING COUNT(DISTINCT gm.match_id) >= 10
     )

SELECT * FROM overall
UNION ALL
SELECT * FROM with_teammates

