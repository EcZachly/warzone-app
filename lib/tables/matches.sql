CREATE TABLE matches (
    match_id TEXT PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    map TEXT,
    mode TEXT,
    duration BIGINT,
    version INT,
    game_type TEXT,
    play_count INT,
    team_count INT
);