SELECT pid
     , state
     , datname
     , usename
     , application_name
     , client_hostname
     , client_port
     , backend_start
     , query_start
     , query
FROM pg_stat_activity
where state <> 'idle'
  and pid <> pg_backend_pid()
order by query_start asc;