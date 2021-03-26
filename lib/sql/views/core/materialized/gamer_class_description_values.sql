CREATE MATERIALIZED VIEW warzone.gamer_class_description_values AS
SELECT
     game_category,
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
            'category', 'kdr',
            'description', '',
            'percentiles', JSON_BUILD_OBJECT(
                'bronze_4_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY kdr), 'percentile', .01),
                'bronze_3_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY kdr), 'percentile', .05),
                'bronze_2_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY kdr), 'percentile', .1),
                'bronze_1_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY kdr), 'percentile', .15),
                'silver_4_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY kdr), 'percentile', .2),
                'silver_3_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY kdr), 'percentile', .25),
                'silver_2_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY kdr), 'percentile', .3),
                'silver_1_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY kdr), 'percentile', .35),
                'gold_4_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY kdr), 'percentile', .4),
                'gold_3_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY kdr), 'percentile', .45),
                'gold_2_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY kdr), 'percentile', .5),
                'gold_1_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY kdr), 'percentile', .55),
                'platinum_4_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY kdr), 'percentile', .6),
                'platinum_3_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY kdr), 'percentile', .65),
                'platinum_2_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY kdr), 'percentile', .7),
                'platinum_1_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY kdr), 'percentile', .75),
                'diamond_4_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY kdr), 'percentile', .8),
                'diamond_3_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY kdr), 'percentile', .85),
                'diamond_2_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY kdr), 'percentile', .9),
                'diamond_1_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY kdr), 'percentile', .95),
                'master_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY kdr), 'percentile', .99),
                'legend_KDR', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY kdr), 'percentile', .999)
                )
        ) as  kdr_tier_cutoffs,
              JSON_BUILD_OBJECT(
                    'category', 'avg_kills',
                    'description', '',
                    'percentiles', JSON_BUILD_OBJECT(
                        'bronze_4_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .01),
                        'bronze_3_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .05),
                        'bronze_2_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .1),
                        'bronze_1_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .15),
                        'silver_4_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .2),
                        'silver_3_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .25),
                        'silver_2_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .3),
                        'silver_1_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .35),
                        'gold_4_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .4),
                        'gold_3_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .45),
                        'gold_2_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .5),
                        'gold_1_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .55),
                        'platinum_4_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .6),
                        'platinum_3_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .65),
                        'platinum_2_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .7),
                        'platinum_1_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .75),
                        'diamond_4_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .8),
                        'diamond_3_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .85),
                        'diamond_2_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .9),
                        'diamond_1_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .95),
                        'master_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .99),
                        'legend_Avg_Kills', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY avg_kills), 'percentile', .999)
                        )
                ) as  avg_kills_tier_cutoffs,
                        JSON_BUILD_OBJECT(
                                    'category', 'gulag_win_rate',
                                    'description', '',
                                    'percentiles', JSON_BUILD_OBJECT(
                                        'bronze_4_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .01),
                                        'bronze_3_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .05),
                                        'bronze_2_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .1),
                                        'bronze_1_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .15),
                                        'silver_4_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .2),
                                        'silver_3_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .25),
                                        'silver_2_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .3),
                                        'silver_1_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .35),
                                        'gold_4_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .4),
                                        'gold_3_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .45),
                                        'gold_2_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .5),
                                        'gold_1_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .55),
                                        'platinum_4_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .6),
                                        'platinum_3_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .65),
                                        'platinum_2_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .7),
                                        'platinum_1_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .75),
                                        'diamond_4_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .8),
                                        'diamond_3_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .85),
                                        'diamond_2_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .9),
                                        'diamond_1_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .95),
                                        'master_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .99),
                                        'legend_Gulag_Win_Rate', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY gulag_win_rate), 'percentile', .999)
                                        )
                                ) as  gulag_win_rate_tier_cutoffs,

                                       JSON_BUILD_OBJECT(
                                                                    'category', 'win_percentage',
                                                                    'description', '',
                                                                    'percentiles', JSON_BUILD_OBJECT(
                                                                        'bronze_4_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .01),
                                                                        'bronze_3_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .05),
                                                                        'bronze_2_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .1),
                                                                        'bronze_1_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .15),
                                                                        'silver_4_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .2),
                                                                        'silver_3_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .25),
                                                                        'silver_2_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .3),
                                                                        'silver_1_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .35),
                                                                        'gold_4_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .4),
                                                                        'gold_3_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .45),
                                                                        'gold_2_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .5),
                                                                        'gold_1_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .55),
                                                                        'platinum_4_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .6),
                                                                        'platinum_3_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .65),
                                                                        'platinum_2_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .7),
                                                                        'platinum_1_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .75),
                                                                        'diamond_4_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .8),
                                                                        'diamond_3_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .85),
                                                                        'diamond_2_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .9),
                                                                        'diamond_1_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .95),
                                                                        'master_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .99),
                                                                        'legend_Win_%', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY win_percentage), 'percentile', .999)
                                                                        )
                                                                ) as  win_percentage_tier_cutoffs,

                                       JSON_BUILD_OBJECT(
                                                                    'category', 'quad_wins',
                                                                    'description', '',
                                                                    'percentiles', JSON_BUILD_OBJECT(
                                                                        'bronze_4_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .01),
                                                                        'bronze_3_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .05),
                                                                        'bronze_2_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .1),
                                                                        'bronze_1_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .15),
                                                                        'silver_4_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .2),
                                                                        'silver_3_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .25),
                                                                        'silver_2_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .3),
                                                                        'silver_1_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .35),
                                                                        'gold_4_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .4),
                                                                        'gold_3_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .45),
                                                                        'gold_2_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .5),
                                                                        'gold_1_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .55),
                                                                        'platinum_4_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .6),
                                                                        'platinum_3_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .65),
                                                                        'platinum_2_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .7),
                                                                        'platinum_1_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .75),
                                                                        'diamond_4_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .8),
                                                                        'diamond_3_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .85),
                                                                        'diamond_2_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .9),
                                                                        'diamond_1_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .95),
                                                                        'master_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .99),
                                                                        'legend_Quad_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY Quad_Wins), 'percentile', .999)
                                                                        )
                                                                ) as  quad_wins_tier_cutoffs,


                                       JSON_BUILD_OBJECT(
                                                                    'category', 'trio_wins',
                                                                    'description', '',
                                                                    'percentiles', JSON_BUILD_OBJECT(
                                                                        'bronze_4_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .01),
                                                                        'bronze_3_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .05),
                                                                        'bronze_2_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .1),
                                                                        'bronze_1_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .15),
                                                                        'silver_4_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .2),
                                                                        'silver_3_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .25),
                                                                        'silver_2_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .3),
                                                                        'silver_1_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .35),
                                                                        'gold_4_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .4),
                                                                        'gold_3_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .45),
                                                                        'gold_2_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .5),
                                                                        'gold_1_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .55),
                                                                        'platinum_4_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .6),
                                                                        'platinum_3_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .65),
                                                                        'platinum_2_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .7),
                                                                        'platinum_1_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .75),
                                                                        'diamond_4_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .8),
                                                                        'diamond_3_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .85),
                                                                        'diamond_2_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .9),
                                                                        'diamond_1_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .95),
                                                                        'master_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .99),
                                                                        'legend_Trio_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY Trio_Wins), 'percentile', .999)
                                                                        )
                                                                ) as  trio_wins_tier_cutoffs,
                                                                 JSON_BUILD_OBJECT(
                                                                                                                                    'category', 'duo_wins',
                                                                                                                                    'description', '',
                                                                                                                                    'percentiles', JSON_BUILD_OBJECT(
                                                                                                                                        'bronze_4_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .01),
                                                                                                                                        'bronze_3_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .05),
                                                                                                                                        'bronze_2_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .1),
                                                                                                                                        'bronze_1_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .15),
                                                                                                                                        'silver_4_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .2),
                                                                                                                                        'silver_3_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .25),
                                                                                                                                        'silver_2_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .3),
                                                                                                                                        'silver_1_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .35),
                                                                                                                                        'gold_4_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .4),
                                                                                                                                        'gold_3_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .45),
                                                                                                                                        'gold_2_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .5),
                                                                                                                                        'gold_1_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .55),
                                                                                                                                        'platinum_4_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .6),
                                                                                                                                        'platinum_3_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .65),
                                                                                                                                        'platinum_2_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .7),
                                                                                                                                        'platinum_1_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .75),
                                                                                                                                        'diamond_4_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .8),
                                                                                                                                        'diamond_3_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .85),
                                                                                                                                        'diamond_2_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .9),
                                                                                                                                        'diamond_1_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .95),
                                                                                                                                        'master_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .99),
                                                                                                                                        'legend_Duo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY Duo_Wins), 'percentile', .999)
                                                                                                                                        )
                                                                                                                                ) as  duo_wins_tier_cutoffs,



                                       JSON_BUILD_OBJECT(
                                                                    'category', 'solo_wins',
                                                                    'description', '',
                                                                    'percentiles', JSON_BUILD_OBJECT(
                                                                        'bronze_4_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.01) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .01),
                                                                        'bronze_3_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .05),
                                                                        'bronze_2_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .1),
                                                                        'bronze_1_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .15),
                                                                        'silver_4_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .2),
                                                                        'silver_3_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .25),
                                                                        'silver_2_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .3),
                                                                        'silver_1_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .35),
                                                                        'gold_4_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .4),
                                                                        'gold_3_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .45),
                                                                        'gold_2_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .5),
                                                                        'gold_1_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .55),
                                                                        'platinum_4_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .6),
                                                                        'platinum_3_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .65),
                                                                        'platinum_2_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .7),
                                                                        'platinum_1_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .75),
                                                                        'diamond_4_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .8),
                                                                        'diamond_3_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .85),
                                                                        'diamond_2_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .9),
                                                                        'diamond_1_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .95),
                                                                        'master_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .99),
                                                                        'legend_Solo_Wins', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY solo_wins), 'percentile', .999)
                                                                        )
                                                                ) as  solo_wins_tier_cutoffs,
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
FROM warzone.gamer_stat_summary
WHERE num_matches >= 100
GROUP BY game_category