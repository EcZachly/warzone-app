CREATE OR REPLACE VIEW warzone.gamer_class_description_values AS
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
    JSON_BUILD_OBJECT(
        'category', 'team_survival_time',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'goldfish', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY team_survival_time), 'percentile', .1),
            'lemming', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY team_survival_time), 'percentile', .33),
            'elephant', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY team_survival_time), 'percentile', .66),
            'tortoise', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY team_survival_time), 'percentile', .90)
            )
    ) as team_survival_cutoffs,

       JSON_BUILD_OBJECT(
        'category', 'percent_time_moving',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'statue', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY percent_time_moving), 'percentile', .1),
            'slug', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY percent_time_moving), 'percentile', .33),
            'dancer', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY percent_time_moving), 'percentile', .66),
            'hummingbird', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY percent_time_moving), 'percentile', .90)
            )
    ) as percent_time_moving_cutoffs,
       JSON_BUILD_OBJECT(
        'category', 'distance_traveled',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'camper', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY distance_traveled), 'percentile', .1),
            'wanderer', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY distance_traveled), 'percentile', .33),
            'traveller', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY distance_traveled), 'percentile', .66),
            'nomad', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY distance_traveled), 'percentile', .90)
            )
    ) as distance_traveled_cutoffs,
    JSON_BUILD_OBJECT(
        'category', 'down_enemy_circle_1',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'pacifist', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY down_enemy_circle_1), 'percentile', .1),
            'peacemaker', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY down_enemy_circle_1), 'percentile', .33),
            'aggressor', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY down_enemy_circle_1), 'percentile', .66),
            'warmonger', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY down_enemy_circle_1), 'percentile', .90)
            )
    ) as down_enemy_circle_1_cutoffs,
        JSON_BUILD_OBJECT(
        'category', 'caches_open',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'looter', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY caches_open), 'percentile', .1),
            'scavenger', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY caches_open), 'percentile', .33),
            'pirate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY caches_open), 'percentile', .66),
            'tomb_raider', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY caches_open), 'percentile', .90)
            )
    ) as looting_cutoffs,
    JSON_BUILD_OBJECT(
        'category', 'missions_started',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'intern', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY missions_started), 'percentile', .1),
            'field_agent', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY missions_started), 'percentile', .33),
            'seal', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY missions_started), 'percentile', .66),
            'secret_agent', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY missions_started), 'percentile', .90)
            )
    ) as missions_cutoffs,
        JSON_BUILD_OBJECT(
        'category', 'teams_wiped',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'surrenderer', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY teams_wiped), 'percentile', .1),
            'vanquisher', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY teams_wiped), 'percentile', .50),
            'conqueror', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY teams_wiped), 'percentile', .90)
            )
    ) as team_wipe_cutoffs,
         JSON_BUILD_OBJECT(
        'category', 'damage_taken',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'uninjured', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.10) WITHIN GROUP (ORDER BY damage_taken), 'percentile', .1),
            'scratched', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.33) WITHIN GROUP (ORDER BY damage_taken), 'percentile', .33),
            'bullet_sponge', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY damage_taken), 'percentile', .66),
            'hospital_patient', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY damage_taken), 'percentile', .90)
            )
    ) as damage_taken_cutoffs,
        JSON_BUILD_OBJECT(
        'category', 'headshots',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
            'trainee', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY headshots), 'percentile', .50),
            'deadeye', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY headshots), 'percentile', .75),
            'headshot_hacker', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY headshots), 'percentile', .90)
          )
    ) as headshots_cutoffs
FROM gamer_agg