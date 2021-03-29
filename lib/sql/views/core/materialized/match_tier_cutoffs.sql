CREATE MATERIALIZED VIEW warzone.match_tier_cutoffs AS
SELECT
    JSON_BUILD_OBJECT(
        'category', 'average_score',
        'description', 'How difficult the lobby is based on how well people score',
        'percentiles', JSON_BUILD_OBJECT(
            'bronze_4_score', JSON_BUILD_OBJECT('value', PERCENTILE_CONT(.01) WITHIN GROUP ( ORDER BY average_player_score), 'percentile', .01),
            'bronze_3_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .05),
            'bronze_2_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .1),
            'bronze_1_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .15),
            'silver_4_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .2),
            'silver_3_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .25),
            'silver_2_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .3),
            'silver_1_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .35),
            'gold_4_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .4),
            'gold_3_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .45),
            'gold_2_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .5),
            'gold_1_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .55),
            'platinum_4_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .6),
            'platinum_3_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .65),
            'platinum_2_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .7),
            'platinum_1_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .75),
            'diamond_4_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .8),
            'diamond_3_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .85),
            'diamond_2_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .9),
            'diamond_1_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .95),
            'master_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .99),
            'legend_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY average_player_score), 'percentile', .999)
        )
    ) as score_cutoffs,
     JSON_BUILD_OBJECT(
            'category', 'average_kdr',
            'description', 'How difficult the lobby is based on how well people score',
            'percentiles', JSON_BUILD_OBJECT(
                'bronze_4_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_CONT(.01) WITHIN GROUP ( ORDER BY average_player_kdr), 'percentile', .01),
                'bronze_3_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .05),
                'bronze_2_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .1),
                'bronze_1_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .15),
                'silver_4_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .2),
                'silver_3_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .25),
                'silver_2_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .3),
                'silver_1_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .35),
                'gold_4_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .4),
                'gold_3_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .45),
                'gold_2_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .5),
                'gold_1_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .55),
                'platinum_4_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .6),
                'platinum_3_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .65),
                'platinum_2_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .7),
                'platinum_1_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .75),
                'diamond_4_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .8),
                'diamond_3_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .85),
                'diamond_2_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .9),
                'diamond_1_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .95),
                'master_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .99),
                'legend_kdr', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY average_player_kdr), 'percentile', .999)
            )
        ) as kdr_cutoffs,

        JSON_BUILD_OBJECT(
            'category', 'average_skill_score',
            'description', 'How difficult the lobby is based on how well people score',
            'percentiles', JSON_BUILD_OBJECT(
                'bronze_4_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_CONT(.01) WITHIN GROUP ( ORDER BY average_player_skill_score), 'percentile', .01),
                'bronze_3_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.05) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .05),
                'bronze_2_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.1) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .1),
                'bronze_1_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.15) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .15),
                'silver_4_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.2) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .2),
                'silver_3_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .25),
                'silver_2_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.3) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .3),
                'silver_1_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.35) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .35),
                'gold_4_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.4) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .4),
                'gold_3_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.45) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .45),
                'gold_2_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .5),
                'gold_1_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.55) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .55),
                'platinum_4_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.6) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .6),
                'platinum_3_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.65) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .65),
                'platinum_2_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.7) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .7),
                'platinum_1_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .75),
                'diamond_4_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.8) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .8),
                'diamond_3_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.85) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .85),
                'diamond_2_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .9),
                'diamond_1_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .95),
                'master_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .99),
                'legend_skill_score', JSON_BUILD_OBJECT('value', PERCENTILE_DISC(0.999) WITHIN GROUP (ORDER BY average_player_skill_score), 'percentile', .999)
            )
        ) as skill_score_cutoffs
FROM warzone.match_level_player_stat_summary_last_3_months

