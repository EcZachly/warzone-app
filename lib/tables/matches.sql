CREATE TABLE warzone.matches (
    match_id TEXT PRIMARY KEY,
    start_time BIGINT,
    end_time BIGINT,
    map TEXT,
    mode TEXT,
    duration BIGINT,
    version INT,
    game_type TEXT,
    player_count INT,
    team_count INT
);