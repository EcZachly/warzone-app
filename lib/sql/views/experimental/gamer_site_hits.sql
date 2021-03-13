CREATE OR REPLACE FUNCTION decode_url_part(p varchar) RETURNS varchar AS $$
SELECT convert_from(CAST(E'\\x' || string_agg(CASE WHEN length(r.m[1]) = 1 THEN encode(convert_to(r.m[1], 'SQL_ASCII'), 'hex') ELSE substring(r.m[1] from 2 for 2) END, '') AS bytea), 'UTF8')
FROM regexp_matches($1, '%[0-9a-f][0-9a-f]|.', 'gi') AS r(m);
$$ LANGUAGE SQL IMMUTABLE STRICT;

CREATE MATERIALIZED VIEW warzone.gamer_site_hits AS
(

WITH events AS (
    SELECT SPLIT_PART(
                    SPLIT_PART(url, '?', 1),
                    '/', 3)
            AS platform,
           DECODE_URL_PART(
                    SPLIT_PART(
                        SPLIT_PART(url, '?', 1),
                    '/', 4)
           ) AS username,
           *
    FROM warzone.site_events
    WHERE UPPER(user_agent ->> 'family') NOT LIKE '%BOT%'
      AND url LIKE '/gamer/%'
)

SELECT platform,
       username,
       COUNT(DISTINCT ip) AS num_distinct_users,
       COUNT(1)           AS num_hits
FROM events
GROUP BY platform, username
);