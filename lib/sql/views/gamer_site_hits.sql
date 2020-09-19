CREATE OR REPLACE VIEW warzone.gamer_site_hits AS
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
           ) AS gamer,
           *
    FROM warzone.site_events
    WHERE UPPER(user_agent ->> 'family') NOT LIKE '%BOT%'
      AND url LIKE '/gamer/%'
)

SELECT platform,
       gamer,
       COUNT(DISTINCT ip) AS num_distinct_users,
       COUNT(1)           AS num_hits
FROM events
GROUP BY platform, gamer
);