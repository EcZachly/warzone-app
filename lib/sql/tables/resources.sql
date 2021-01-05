CREATE TABLE warzone.resources (
    resource_id SERIAL PRIMARY KEY,
    name TEXT,
    type TEXT, -- field upgrade, killstreak, location, etc
    image_url TEXT -- image we want to show
)
