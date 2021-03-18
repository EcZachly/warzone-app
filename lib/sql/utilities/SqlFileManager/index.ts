import FileService from '../../../components/Files/FileService';

//===--=--=-==--=-=-=-=---==--=----=-==-======--=--=-==--=-=-=-=---==--=----=-==-===//




export async function ensureCompleteData(viewConfigList) {
    let fileListObject = await getFileListObject();
    let fileList = fileListObjectToFileList(fileListObject);
    let viewConfigFileList = viewConfigList.map((viewConfig) => viewConfig.path);

    let filesNotFoundInViewConfig = fileList.filter((file) => viewConfigFileList.includes(file) === false);
    let viewConfigsNotFoundInFiles = viewConfigFileList.filter((file) => fileList.includes(file) === false);

    if (filesNotFoundInViewConfig.length > 0) {
        throw new Error('The following files exist, but were not found in the viewConfigList: ' + JSON.stringify(filesNotFoundInViewConfig));
    }

    if (viewConfigsNotFoundInFiles.length > 0) {
        throw new Error('The following exist in the viewConfigList, but were not found in the files: ' + JSON.stringify(viewConfigsNotFoundInFiles));
    }
}



function fileListObjectToFileList(fileListObject): string[] {
    let fileList = [];

    Object.keys(fileListObject).forEach((folder) => {
        let files = fileListObject[folder];

        files.forEach((file) => {
            fileList.push([folder, file].join('/'));
        });
    });

    return fileList;
}



async function getFileListObject() {
    return new Promise(async (resolve, reject) => {
        let map = {
            'tables': await getFileListFromPath('/../../tables'),
            'views/core': await getFileListFromPath('/../../views/core'),
            'views/core/materialized': await getFileListFromPath('/../../views/core/materialized'),
            'views/detail': await getFileListFromPath('/../../views/detail'),
            'views/detail/materialized': await getFileListFromPath('/../../views/detail/materialized'),
            'views/etl': await getFileListFromPath('/../../views/etl')
        };

        resolve(map);
    });
}



function getFileListFromPath(path) {
    return new Promise((resolve, reject) => {
        FileService.getFolderContents(__dirname + path).then((fileList) => {
            resolve(fileList.filter((fileName) => fileName.includes('.sql')));
        }).catch(reject);
    });
}


export default {
    ensureCompleteData
};
