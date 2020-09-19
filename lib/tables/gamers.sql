CREATE TABLE warzone.gamers
(
	username TEXT,
	platform TEXT,
	priority_number INTEGER,
	needs_backfill BOOLEAN,
	needs_update BOOLEAN,
	PRIMARY KEY (username, platform)
);