import * as electron from 'electron';
import * as path from 'path';
import * as querystring from "querystring";
import * as URL from "url";

import {config} from "./common/config";
import {locale} from "./common/locale";
import {MenuService} from "./common/menuService";
import {ENWindow, IWindowConfig} from "./common/window";
import {initIpcMain} from "./common/ipc";

const debug = /--debug/.test(process.argv[2]);

let mainWindow: Electron.BrowserWindow = null;

function initialize () {
    let shouldQuit = makeSingleInstance();
    if (shouldQuit) {
        console.info('App has started.');
        return electron.app.quit();
    }

    // set config locale.
    // locale.setLocale(config.getLocale());

    // console.info('app name', locale.get('appName'));
    // electron.app.setName(locale.get('appName'));
    electron.app.setName('Encrypted Note');

    function createWindow () {
        let testFilePath = '/Users/sky/Documents/workspace/encrypted-note/tempfile.ent';
        ENWindow.createWorkspace(/*false, {filePath: testFilePath}*/).then((win) => {
            console.log('create win.');
        }, (e) => {
            console.log('create win error.', e);
        });
    }

    electron.app.on('ready', function () {
        MenuService.initialize();
        initIpcMain();

        createWindow();
        // autoUpdater.initialize();

        // miotServer.open();
    });

    electron.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        }
    });

    electron.app.on('activate', function () {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    electron.app.on('quit', function () {
        // miotServer.close();
    })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
    if (process.mas) {
        return false;
    }

    return electron.app.makeSingleInstance(function () {
        let allWin = electron.BrowserWindow.getAllWindows();
        if (allWin.length > 0) {
            let win = allWin[allWin.length - 1];
            if (win.isMinimized()) {
                win.restore();
            }
            win.focus();
        }
    });
}

initialize();
