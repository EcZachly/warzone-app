CREATE TABLE warzone.gamers
(
	username TEXT,
	platform TEXT,
	priority_number INTEGER,
	needs_backfill BOOLEAN,
	no_permission BOOLEAN,
	needs_update BOOLEAN,
	uno_id NUMERIC(38, 0),
	PRIMARY KEY (username, platform)
);