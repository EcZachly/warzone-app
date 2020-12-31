const fs = require('fs');

import TypeService from '../../../src/services/TypeService';

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PUBLIC METHODS


export async function readFile(fullFilePath: string, options?: { encoding?: string }): Promise<string> {
    return new Promise(async (resolve, reject) => {
        options = (TypeService.isObject(options)) ? options : {};
        const encoding = (TypeService.isString(options.encoding, true)) ? options.encoding : 'utf-8';

        fs.access(fullFilePath, fs.F_OK, (error) => {
            if (error) {
                reject(new Error('file at ' + fullFilePath + ' does not exist'));
            } else {
                fs.readFile(fullFilePath, {encoding}, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    });
}



export async function getFolderContents(fullFilePath: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        fs.readdir(fullFilePath, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}



//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PRIVATE METHODS


export default {
    readFile,
    getFolderContents
};