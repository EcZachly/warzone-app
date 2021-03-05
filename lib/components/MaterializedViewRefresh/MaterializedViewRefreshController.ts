import {RawMaterializedViewRefresh, RawMaterializedViewRefreshList} from './MaterializedViewRefreshTypes';
import {DAO} from '../Database';
import {TABLES} from '../../constants';
import {QueryOptions} from '../Database/DAO';



export async function createMaterializedViewRefresh(materializedViewRefresh: Partial<RawMaterializedViewRefresh>): Promise<RawMaterializedViewRefresh> {
    return new Promise(async (resolve, reject) => {
        try {
            const newMaterializedViewRefresh = await DAO.insert(TABLES.MATERIALIZED_VIEW_REFRESH, materializedViewRefresh);

            if (newMaterializedViewRefresh) {
                resolve(newMaterializedViewRefresh);
            } else {
                reject(new Error('an unknown error occurred'));
            }
        } catch (error) {
            reject(error);
        }
    });
}



export async function updateMaterializedViewRefresh(query: Partial<RawMaterializedViewRefresh>, materializedViewRefresh: Partial<RawMaterializedViewRefresh>): Promise<RawMaterializedViewRefresh> {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedMaterializedViewRefresh = await DAO.update(TABLES.MATERIALIZED_VIEW_REFRESH, query, materializedViewRefresh);
            resolve(updatedMaterializedViewRefresh);
        } catch (error) {
            reject(error);
        }
    });
}



export async function queryMaterializedViewRefresh(query: Partial<RawMaterializedViewRefresh>, options?: QueryOptions): Promise<RawMaterializedViewRefreshList> {
    return DAO.find(TABLES.MATERIALIZED_VIEW_REFRESH, query, options);
}



export default {
    createMaterializedViewRefresh,
    updateMaterializedViewRefresh,
    queryMaterializedViewRefresh
};