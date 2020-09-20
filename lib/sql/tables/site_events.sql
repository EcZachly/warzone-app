create table warzone.site_events
(
	url TEXT,
	referrer TEXT,
	ip TEXT,
	body JSON,
	user_agent JSON,
	headers JSON,
	query JSON,
	event_time TIMESTAMP,
	host TEXT
);