CREATE TABLE warzone.matches (
    match_id NUMERIC(38,0) PRIMARY KEY,
    start_time BIGINT,
    end_time BIGINT,
    map TEXT,
    mode TEXT,
    duration BIGINT,
    version INT,
    game_type TEXT,
    player_count INT,
    team_count INT,
    team_type TEXT,
    game_category TEXT,
    start_timestamp TIMESTAMP,
    end_timestamp TIMESTAMP
);