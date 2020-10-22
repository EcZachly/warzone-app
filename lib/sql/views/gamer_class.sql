CREATE VIEW  warzone.gamer_classes AS
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

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY objective->>'down_enemy_circle_1') AS pacifist,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY objective->>'down_enemy_circle_1') AS peacemaker,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY objective->>'down_enemy_circle_1') AS aggressor,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY objective->>'down_enemy_circle_1') AS warmonger,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY CAST(objective->>'caches_open' AS INTEGER)) AS looter,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY CAST(objective->>'caches_open' AS INTEGER)) AS scavenger,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY CAST(objective->>'caches_open' AS INTEGER)) AS pirate,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY CAST(objective->>'caches_open' AS INTEGER)) AS tomb_raider,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY objective->>'missions_started') AS intern,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY objective->>'missions_started') AS field_agent,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY objective->>'missions_started') AS seal,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY objective->>'missions_started') AS secret_agent,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY objective->>'teams_wiped') AS surrenderer,
   PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY objective->>'teams_wiped') AS vanquisher,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY objective->>'teams_wiped') AS conqueror,

   PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY damage_taken) AS uninjured,
   PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY damage_taken) AS scratched,
   PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY damage_taken) AS bullet_sponge,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY damage_taken) AS hospital_patient,

   PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY headshots) AS trainee,
   PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY headshots) AS deadeye,
   PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY headshots) AS headshot_hacker

FROM warzone.gamer_matches