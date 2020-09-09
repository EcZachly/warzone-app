CREATE VIEW warzone.player_team_summary_stats AS

SELECT gm.username, gm2.username, SUM(gm.kills) AS total_kills, COUNT(1) as num_games
FROM warzone.gamer_matches gm
    JOIN warzone.gamer_matches gm2
        ON gm.match_id = gm2.match_id
        AND gm.team = gm2.team
        AND gm.username <> gm2.username
GROUP BY 1,2
