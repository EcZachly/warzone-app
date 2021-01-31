import {FileService} from './../../lib/components/Files';

import tracer from 'tracer';
const logger = tracer.colorConsole();

import childProcess from 'child_process';
const exec = childProcess.exec;


const CONFIG = {
    PROJECT: null
};

const b = '\n\b';
const lb = '--==-=-=-==----==-=-=-==----==-=-=-==----==-=-=-==----==-=-=-==----==-=-=-==--' + b;

//=--=-=--==--=-==-=-=-==-=-=--=-=--==--=-==-=-=-==-=-=--=-=--==--=-==-=-=-==-=-//


export function check(): void {
    readPackageJsonFile().then(() => {
        checkNodeVersion();
        checkNpmVersion();
    });
}


function checkNodeVersion() {
    const requiredNodeVersion = CONFIG.PROJECT['exact-engines'].node;
    const currentNodeVersion = process && process.versions && process.versions.node;

    if (requiredNodeVersion === currentNodeVersion) {
        return 1;
    } else {
        logger.error(
            b + b + b + lb + b +
            'YOU ARE USING THE WRONG VERSION OF NODE.' + b + b +
            'YOUR VERSION: ' + currentNodeVersion + b +
            'REQUIRED VERSION: ' + requiredNodeVersion +
            b + b + lb + b + b + b
        );

        process.exit(1);
    }
}


function checkNpmVersion() {
    executeCommand('npm -v', (currentNpmVersion) => {
        const requiredNpmVersion = CONFIG.PROJECT['exact-engines'].npm;

        if (requiredNpmVersion === currentNpmVersion) {
            return 1;
        } else {
            logger.error(
                b + b + b + lb + b +
                'YOU ARE USING THE WRONG VERSION OF NPM.' + b + b +
                'YOUR VERSION: ' + currentNpmVersion + b +
                'REQUIRED VERSION: ' + requiredNpmVersion +
                b + b + lb + b + b + b
            );

            process.exit(1);
        }
    });
}


function executeCommand(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout.trim());
    });
}


function readPackageJsonFile(): Promise<void> {
    return new Promise((resolve, reject) => {
        FileService.readFile(__dirname + '/../../package.json').then((fileContents) => {
            CONFIG.PROJECT = JSON.parse(fileContents);
            resolve();
        }, (error) => {
            logger.error(error);
            process.exit(1);
        });
    });
}



export default {
    check
};