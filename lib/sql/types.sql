CREATE TYPE relationship_edge AS (
                                    relationship_stat text,
                                    relationship_type TEXT,
                                    stat_with_player REAL,
                                    overall_stat REAL,
                                    ratio REAL,
                                    helper_stat_with_player REAL,
                                    helper_overall_stat REAL,
                                    helper_ratio REAL,
                                    lower_is_better BOOLEAN
                                    );