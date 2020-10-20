CREATE TABLE IF NOT EXISTS warzone.etl_jobs (
    job_id TEXT PRIMARY KEY,
    job_name TEXT,
    execution_start_time BIGINT,
    execution_end_time BIGINT,
    is_successful BOOLEAN,
    metadata JSON
);