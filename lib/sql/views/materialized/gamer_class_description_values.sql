
CREATE MATERIALIZED VIEW warzone.gamer_class_description_values AS
SELECT
    COALESCE(game_category, '(all)') as game_category,
    JSON_BUILD_OBJECT(
        'category', 'team_survival_time_mins',
        'description', '',
        'percentiles', JSON_BUILD_OBJECT(
             'elephant', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.66) WITHIN GROUP (ORDER BY team_survival_time_mins), 'percentile', .66),
            'tortoise', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY team_survival_time_mins), 'percentile', .90)
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
            'deadeye', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY headshots), 'percentile', .75),
            'headshot_hacker', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY headshots), 'percentile', .90)
          )
    ) as headshots_cutoffs,
        JSON_BUILD_OBJECT(
            'category', 'win_percentage',
            'description', '',
            'percentiles', JSON_BUILD_OBJECT(
                'winner', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.50) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .50),
                'champion', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .75),
                'god', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .90)
              )
        ) as win_percentage_cutoffs
FROM warzone.player_stat_summary
GROUP BY GROUPING SETS (
  (),
  (game_category)
  )