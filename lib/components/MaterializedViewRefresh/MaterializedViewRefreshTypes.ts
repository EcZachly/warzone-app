

type Timestamp = Date;

export type RawMaterializedViewRefresh = {
    refresh_id: string, //1, 2, 3, 4, 5, 6...
    view_id: string, //gamer_stat_summary_materialized
    duration_seconds: number,
    start_timestamp: Timestamp,
    end_timestamp: Timestamp,
    error_message?: string,
    status: 'failure' | 'in progress' | 'success',
};


export type RawMaterializedViewRefreshList = RawMaterializedViewRefreshList[];


//go through list, check for last time job was run in db
    //if the job was run too recently, skip
//for each item, skip if ran too recently and do nothing if all are up to date

//If item hasn't been run too recently, run the refresh and only that one
    //create the record in db
    //run the refresh
        //if successful, then update the record in the db and end process