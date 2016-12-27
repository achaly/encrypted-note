import * as electron from 'electron';
import * as path from 'path';

import {config} from "./common/config";
import {locale} from "./common/locale";

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;

function initialize () {
    let shouldQuit = makeSingleInstance();
    if (shouldQuit) {
        return app.quit();
    }

    console.log('dirname', __dirname);

    // set config locale.
    locale.setLocale(config.getLocale());

    console.info('app name', locale.get('appName'));
    app.setName(locale.get('appName'));

    function createWindow () {
        let windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName()
        };

        if (process.platform === 'linux') {
            // windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
        }

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, 'page', 'index.html'));

        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
        }

        mainWindow.on('closed', function () {
            mainWindow = null
        });
    }

    app.on('ready', function () {
        createWindow();
        // autoUpdater.initialize();

        // miotServer.open();
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });

    app.on('quit', function () {
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

    return app.makeSingleInstance(function () {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

initialize();
