import * as electron from "electron";
import {ENWindow} from "./window";
import OpenDialogOptions = Electron.OpenDialogOptions;
/**
 * main
 */
export class Action {

    /**
     * open new window.
     * @type {string}
     */
    static NewWin: string = 'new-win';

    /**
     * close current window.
     * @type {string}
     */
    static CloseWin: string = 'close-win';

    /**
     * new tab in current window.
     * @type {string}
     */
    static NewTab: string = 'new-tab';

    /**
     * del tab in current window.
     * @type {string}
     */
    static DelTab: string = 'del-tab';

    /**
     * open new file.
     * @type {string}
     */
    static OpenFile: string = 'open-file';

    /**
     * save file.
     * @type {string}
     */
    static SaveFile: string = 'save-file';


}

export function initIpcMain() {
    electron.ipcMain.on(Action.NewWin, (event) => {
        ENWindow.createWorkspace().then((win) => {});
    });

    electron.ipcMain.on(Action.OpenFile, (event, filePath) => {
        ENWindow.createWorkspace(false, {filePath: filePath}).then((win) => {});
    });

}