import * as path from 'path';
import * as querystring from "querystring";
import * as _ from "underscore";
import * as electron from "electron";

import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowOptions = Electron.BrowserWindowOptions;

export interface IWindowConfig {
    url: string;
}

interface IWindow {
    getBrowserWindow(): BrowserWindow
}

export class ENWindow implements IWindow {
    private win: BrowserWindow;

    constructor() {
    }

    static create(config: IWindowConfig, option?: BrowserWindowOptions): ENWindow {
        let enWin = new ENWindow();
        enWin.createWin(config, option);
        return enWin;
    }

    static createWorkspace(query?: {filePath: string}): ENWindow {
        let url = path.join('file://', __dirname, '../page', 'index.html');
        if (query) {
            let q = querystring.stringify({
                filePath: query.filePath
            });
            url += '?' + q;
        }
        let enWin = new ENWindow();
        let config = {
            url: url
        };

        enWin.createWin(config);
        return enWin;
    }

    createWin(config: IWindowConfig, option?: BrowserWindowOptions): void {
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

        this.win = new electron.BrowserWindow(defaultOption);
        this.win.loadURL(config.url);
    }

    getBrowserWindow(): Electron.BrowserWindow {
        return this.win;
    }

}