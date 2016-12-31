import * as electron from "electron";
import {Menu, BrowserWindow, shell, app, ipcMain} from "electron";
import MenuItemOptions = Electron.MenuItemOptions;


export class MenuService {
    constructor() {
        let template: MenuItemOptions[] = [{
            label: 'File',
            submenu: [{
                label: 'New File',
                accelerator: 'CmdOrCtrl+N',
                click: () => {

                }
            }, {
                label: 'New Tab',
                accelerator: 'CmdOrCtrl+T',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send('new-tab');
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
                    shell.openExternal('http://electron.atom.io')
                }
            }]
        }];

        if (process.platform === 'darwin') {
            const name = app.getName();
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
                        app.quit()
                    }
                }]
            })
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

}



