import MenuItemOptions = Electron.MenuItemOptions;

import * as electron from "electron";

import {Action} from "./ipc";
import {ENWindow} from "./window";

export class MenuService {
    static initialize(): void {
        let template: MenuItemOptions[] = [{
            label: 'File',
            submenu: [{
                label: 'New File',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    ENWindow.createWorkspace();
                }
            }, {
                label: 'New Tab',
                accelerator: 'CmdOrCtrl+T',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send(Action.NewTab);
                }
            }, {
                type: 'separator'
            }, {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send(Action.SaveFile);
                }
            }, {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send(Action.CloseWin);
                }
            }]
        }, {
            label: 'Edit',
            submenu: [{
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            }, {
                label: 'Redo',
                accelerator: 'CmdOrCtrl+Y',
                role: 'redo'
            }, {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            }, {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            }, {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            }, {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }]
        }, {
            label: 'Help',
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click: function () {
                    // electron.shell.openExternal('http://electron.atom.io')
                }
            }]
        }];

        if (process.platform === 'darwin') {
            const name = electron.app.getName();
            template.unshift({
                label: name,
                submenu: [{
                    label: `About ${name}`,
                    role: 'about'
                }, {
                    type: 'separator'
                }, {
                    label: `Hide ${name}`,
                    accelerator: 'Command+H',
                    role: 'hide'
                }, {
                    label: 'Hide Others',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                }, {
                    label: 'Show All',
                    role: 'unhide'
                }, {
                    type: 'separator'
                }, {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function () {
                        electron.app.quit()
                    }
                }]
            })
        }

        const menu = electron.Menu.buildFromTemplate(template);
        electron.Menu.setApplicationMenu(menu);
    }

}
