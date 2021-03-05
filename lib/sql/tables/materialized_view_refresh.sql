create table warzone.materialized_view_refresh
(
    refresh_id serial,
    view_id varchar(100) not null,
    duration_seconds integer,
    start_timestamp timestamp,
    end_timestamp timestamp,
    status varchar(20) not null,
    error text,
    primary key (refresh_id)
)