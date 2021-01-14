CREATE OR REPLACE VIEW warzone.followed_gamers AS
with followed AS (
SELECT DISTINCT username, platform
FROM warzone.gamer_relationships
)
SELECT f.username, f.platform, g.needs_update, g.needs_backfill
FROM warzone.gamers g
    JOIN followed f
        ON f.username = g.username
         AND f.platform = g.platform
