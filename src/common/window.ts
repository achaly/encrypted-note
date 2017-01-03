import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowOptions = Electron.BrowserWindowOptions;

import * as path from 'path';
import * as _ from "underscore";
import * as electron from "electron";

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

    static createWorkspace(): ENWindow {
        let enWin = new ENWindow();
        let config = {
            url: path.join('file://', __dirname, '..', 'page', 'index.html')
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