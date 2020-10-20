CREATE VIEW  warzone.gamer_classes_avg AS
WITH gamer_agg AS (
       SELECT
            query_username,
            query_platform,
            AVG(team_survival_time) AS team_survival_time,
            AVG(percent_time_moving) as percent_time_moving,
            AVG(distance_traveled) AS distance_traveled,
            AVG(CAST(objective->>'down_enemy_circle_1' AS INTEGER)) as down_enemy_circle_1,
            AVG(CAST(objective->>'caches_open' AS INTEGER)) as caches_open,
            AVG(CAST(objective->>'missions_started' AS INTEGER)) as missions_started,
            AVG(CAST(objective->>'teams_wiped' AS INTEGER)) as teams_wiped,
            AVG(damage_taken) as damage_taken,
            AVG(headshots) as headshots
        FROM warzone.gamer_matches
        GROUP BY query_username, query_platform
)
SELECT

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY team_survival_time) AS goldfish,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY team_survival_time) AS lemming,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY team_survival_time) AS elephant,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY team_survival_time) AS tortoise,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY percent_time_moving) AS statue,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY percent_time_moving) AS slug,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY percent_time_moving) AS dancer,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY percent_time_moving) AS hummingbird,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY distance_traveled) AS camper,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY distance_traveled) AS wanderer,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY distance_traveled) AS traveller,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY distance_traveled) AS nomad,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY down_enemy_circle_1) AS pacifist,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY down_enemy_circle_1) AS peacemaker,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY down_enemy_circle_1) AS aggressor,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY down_enemy_circle_1) AS warmonger,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY caches_open) AS looter,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY caches_open) AS scavenger,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY caches_open) AS pirate,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY caches_open) AS tomb_raider,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY missions_started) AS intern,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY missions_started) AS field_agent,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY missions_started) AS seal,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY missions_started) AS secret_agent,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY teams_wiped) AS surrenderer,
   PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY teams_wiped) AS vanquisher,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY teams_wiped) AS conqueror,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY damage_taken) AS uninjured,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY damage_taken) AS scratched,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY damage_taken) AS bullet_sponge,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY damage_taken) AS hospital_patient,

   PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY headshots) AS trainee,
   PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY headshots) AS deadeye,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY headshots) AS headshot_hacker

FROM gamer_agg