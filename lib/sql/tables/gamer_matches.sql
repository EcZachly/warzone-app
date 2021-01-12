CREATE TABLE warzone.gamer_matches (
    query_username TEXT,
    query_platform TEXT,
    match_id TEXT REFERENCES warzone.matches(match_id),
    uno_id TEXT,
    username TEXT,
    team TEXT,
    clan_tag TEXT,
    kills INT,
    assists INT,
    deaths INT,
    score INT,
    damage_done INT,
    damage_taken INT,
    team_placement INT,
    longest_streak INT,
    time_played INT,
    distance_traveled REAL,
    team_survival_time BIGINT,
    percent_time_moving REAL,
    wall_bangs INT,
    gulag_deaths INT,
    gulag_kills INT,
    headshots INT,
    executions INT,
    objective JSON,
    xp JSON,
    loadout JSON,
    contracts JSON,
    raw_data JSON,
    PRIMARY KEY (query_username, query_platform, uno_id, match_id)
);