import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowOptions = Electron.BrowserWindowOptions;

export interface IWindow {

    getBrowserWindow(): BrowserWindow
}

export class Window implements IWindow {
    private win: BrowserWindow;

    constructor(url: string, option?: BrowserWindowOptions) {
        let defaultOption: BrowserWindowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: 'xxx'
        };

        if (option) {
            _.extend(defaultOption, option);
        }

        this.win = new BrowserWindow(defaultOption);
        this.win.loadURL(url);

        this.win.on('close', () => {
            this.win = null;
        });
    }

    getBrowserWindow(): Electron.BrowserWindow {
        return this.win;
    }

}