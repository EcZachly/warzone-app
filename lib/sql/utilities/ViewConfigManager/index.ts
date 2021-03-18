import Bluebird from 'bluebird';

import viewConfig, {ViewConfigObject, ViewConfigList} from './viewConfig';
import FileService from '../../../components/Files/FileService';



export async function getViewConfigList(basePath) {
    let viewConfigList = viewConfig.map((viewConfig: ViewConfigObject, index) => {
        viewConfig.path = generatePathToSQLFile(viewConfig);
        viewConfig.position = index + 1;
        viewConfig.fullPath = basePath + '/' + viewConfig.path;
        return viewConfig;
    });

    return Bluebird.mapSeries(viewConfigList, async (viewConfig: ViewConfigObject) => {
        viewConfig.rawSQL = await FileService.readFile(viewConfig.fullPath);
        return Promise.resolve(viewConfig);
    });
}



function generatePathToSQLFile(viewConfig: ViewConfigObject): string {
    const {name, type, materialized, group} = viewConfig;

    return [
        type + 's',
        group,
        materialized ? 'materialized' : null,
        name + '.sql'
    ].filter((value) => value).join('/');
}



export default {
    getViewConfigList
};