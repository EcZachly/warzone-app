create or replace view warzone._gamer_matches_augmented AS
SELECT
       gm.uno_id AS uno_id,
       gm.query_username as username,

       gm.query_platform as platform,
       gm.username       as in_game_username,
       gm.team,
       gm.clan_tag,
       gm.kills,
       gm.assists,
       gm.deaths,
       gm.damage_taken,
       gm.time_played,
       gm.score,
       gm.damage_done,
       gm.team_placement,
       gm.longest_streak,
       gm.distance_traveled,
       gm.team_survival_time,
       gm.percent_time_moving,
       gm.wall_bangs,
       gm.gulag_deaths,
       gm.gulag_kills,
       gm.headshots,
       gm.executions,
       gm.objective,
       gm.xp,
       m.match_id,
       m.start_time,
       m.end_time,
       m.map,
       m.mode,
       m.duration,
       m.version,
       m.game_type,
       m.player_count,
       m.team_count,
       m.start_timestamp,
       m.end_timestamp,
       m.team_type,
       m.game_category,
       concat(gm.query_platform, '-', gm.query_username) as platform_username
FROM warzone.gamer_matches gm
         JOIN warzone.matches m ON gm.match_id = m.match_id;
