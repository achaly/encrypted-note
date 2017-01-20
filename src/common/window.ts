import * as path from 'path';
import * as querystring from "querystring";
import * as _ from "underscore";
import * as electron from "electron";

import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowOptions = Electron.BrowserWindowOptions;
import OpenDialogOptions = Electron.OpenDialogOptions;

export interface IWindowConfig {
    title: string;
    url: string;
}

export class ENWindow {

    static create(config: IWindowConfig, option?: BrowserWindowOptions): Promise<BrowserWindow> {
        return Promise.resolve(ENWindow.createWin(config, option));
    }

    static createWorkspace(showDialog: boolean = false, query?: {filePath: string}): Promise<BrowserWindow> {
        return new Promise<string>((resolve, reject) => {
            if (!showDialog) {
                resolve();
                return;
            }
            let option: OpenDialogOptions = {
                title: 'open file',
                filters: [
                    {name: 'Ent Files', extensions: ['ent']},
                    // {name: 'All Files', extensions: ['*']}
                ],
                properties: ['openFile']
            };
            electron.dialog.showOpenDialog(option, (fileNames) => {
                if (fileNames && fileNames.length > 0) {
                    resolve(fileNames[0]);
                } else {
                    resolve();
                }
            });

        }).then((res) => {
            let filePath = res || (query && query.filePath) || null;
            let url = path.join('file://', __dirname, '../page', 'index.html');
            if (filePath) {
                let q = querystring.stringify({
                    filePath: filePath
                });
                url += '?' + q;
            }
            let config = {
                title: electron.app.getName(),
                url: url
            };

            return ENWindow.createWin(config);
        });
    }

    static createWin(config: IWindowConfig, option?: BrowserWindowOptions): BrowserWindow {
        let defaultOption: BrowserWindowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            minHeight: 400,
            title: electron.app.getName()
        };

        if (option) {
            _.extend(defaultOption, option);
        }

        let win: BrowserWindow = new electron.BrowserWindow(defaultOption);
        win.loadURL(config.url);
        return win;
    }

}