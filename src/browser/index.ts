import * as querystring from "querystring";
import * as URL from "url";
import * as Vue from "vue/dist/vue";
import * as _ from "underscore";
import * as electron from "electron";

import {config} from "../common/config";
import {locale} from "../common/locale";
import {FileContent} from "../common/fileContent";
import {generateUUID, genrateDate} from "../common/utils";
import {Action} from "../common/ipc";
import {ENWindow, IWindowConfig} from "../common/window";
import {enDialog} from "../common/enDialog";

import BrowserWindow = Electron.BrowserWindow;
import OpenDialogOptions = Electron.OpenDialogOptions;
import SaveDialogOptions = Electron.SaveDialogOptions;
import ShowMessageBoxOptions = Electron.ShowMessageBoxOptions;

// debug
electron.remote.getCurrentWindow().webContents.openDevTools();

new Vue({
    el: '#index',
    data: {
        filePath: null,
        fileContent: null,
        password: null,
        isLocked: true,

        paperKey: '',
        paperText: '',

        showEditor: true,

        canClose: true,
        hasSaved: false,
    },

    computed: {
        sidebarList: function () {
            let list = [];
            if (this.fileContent) {
                let content: FileContent = this.fileContent;
                let key = this.paperKey;
                _.forEach(content.papers, function (paper) {
                    let m = paper.text.substr(0, 10).match(/[^\s\b\n\f\r\t\v]+/);
                    let title = m ? m[0] : '';
                    let createdAt = paper.createdAt > 0 ? genrateDate(paper.createdAt) : '';
                    let updatedAt = paper.updatedAt > 0 ? genrateDate(paper.updatedAt) : '';
                    let selected = key == paper.key ? 'ws-sidebar-item-selected': null;
                    list.push({
                        key: paper.key,
                        title: title,
                        createdAt: createdAt,
                        updatedAt: updatedAt,
                        text: paper.text,
                        selected: selected
                    })
                });
            }
            return list;
        }
    },

    watch: {
        paperText: function () {
            if (this.fileContent) {
                console.info('watch paper text');
                let content: FileContent = this.fileContent;
                let paper = _.find(content.papers, (paper) => {
                    return paper.key === this.paperKey;
                });
                if (paper) {
                    if (!_.isEqual(paper.text, this.paperText)) {
                        paper.text = this.paperText;
                        this.hasSaved = false;
                        this.canClose = false;

                        let date = Date.now();
                        paper.createdAt = paper.createdAt === 0 ? date : paper.createdAt;
                        paper.updatedAt = date;
                    }
                }
            }
        },
    },

    methods: {
        clickBaidu(event): void {
            console.info('baidu');
        },

        onTabClick(event): void {
            let textarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('ws-editor-main-textarea');
            let s = textarea.selectionStart;
            textarea.value = textarea.value.substring(0, textarea.selectionStart) + '\t' + textarea.value.substring(textarea.selectionEnd);
            textarea.selectionEnd = s + 1;
        },

        clickDrop(event): void {
        },

        processArgs(): void {
            console.info('process args');
            this.showEditor = true;
            this.fileContent = new FileContent();
            this.paperKey = this.fileContent.papers[0].key;
            this.paperText = this.fileContent.papers[0].text;
            let url = URL.parse(window.location.href, true);
            if (url.query) {
                this.filePath = url.query['filePath'];
            }
            if (this.filePath) {
                this.load(this.filePath);
            }
        },

        processWin(): void {
            console.info('process win');

            // mouse click x.
            window.onbeforeunload = (e) => {
                console.log('window.onbeforeunload');
                if (this.canClose) {
                    return null;

                } else {
                    this.processClose();
                    return false;
                }
            };

            document.getElementById('ws-btn-lock-icon')
        },

        processIpc(): void {
            console.info('process ipc');

            electron.ipcRenderer.on(Action.OpenFile, () => {
                this.clickOpenFile();
            });

            electron.ipcRenderer.on(Action.NewTab, () => {
                this.clickNewTab();
            });

            electron.ipcRenderer.on(Action.SaveFile, () => {
                this.clickSave();
            });

            electron.ipcRenderer.on(Action.CloseWin, () => {
                this.processClose();
            });

        },

        processClose(): void {
            console.info('process close');
            new Promise<number>((resolve, reject) => {
                if (this.hasSaved) {
                    resolve(3);
                    return;
                }

                let option: ShowMessageBoxOptions = {
                    type: 'question',
                    buttons: ['Save', 'Don\'t save', 'Cancel'],
                    defaultId: 0,
                    title: 'Message',
                    message: 'Save file to disk ?',
                    cancelId: 2
                };
                electron.remote.dialog.showMessageBox(option, (response) => {
                    resolve(response);
                })

            }).then((res) => {
                switch (res) {
                    case 0: { // save
                        return this.save();
                    }
                    case 1: { // don't save
                        this.canClose = true;
                        setTimeout(() => {
                            electron.remote.getCurrentWindow().close();
                        }, 0);
                        return Promise.reject('do not save');
                    }
                    case 2: { // cancel.
                        return Promise.reject('cancel');
                    }
                    case 3: { // has saved.
                        this.canClose = true;
                        setTimeout(() => {
                            electron.remote.getCurrentWindow().close();
                        }, 0);
                        return Promise.reject('has saved');
                    }
                    default: {
                        return Promise.reject('unknown err.');
                    }
                }

            }).then((res) => {
                if (res) {
                    console.info('save success.');
                    this.canClose = true;
                    electron.remote.getCurrentWindow().close();
                } else {
                    console.info('save failed.');
                }

            }).catch((e) => {
                console.info('close win', e);
            });
        },

        clickSidebarItem: function (item): void {
            let key = item.key;
            if (key === this.paperKey) {

            } else {
                if (_.isEmpty(this.paperText)) {
                    let content: FileContent = this.fileContent;
                    this.fileContent.papers = _.filter(content.papers, (paper) => {
                        return !_.isEmpty(paper.text);
                    })
                }
                this.paperKey = item.key;
                this.paperText = item.text;
            }
        },

        clickNewTab(event): void {
            let content: FileContent = this.fileContent;
            let blankPaper = _.find(content.papers, (paper) => {
                return _.isEmpty(paper.text);
            });
            if (!blankPaper) {
                let key = generateUUID();
                let date = Date.now();
                this.fileContent.papers.unshift({
                    key: key,
                    createdAt: date,
                    updatedAt: date,
                    text: ''
                });
                this.paperKey = key;
                this.paperText = '';
                this.hasSaved = false;
            }
        },

        clickDel(event): void {
            let content: FileContent = this.fileContent;
            if (content.papers.length === 1) {
                this.paperText = '';
                content.papers[0].text = '';
                content.papers[0].createdAt = 0;
                content.papers[0].updatedAt = 0;
            } else {
                content.papers = _.filter(content.papers, (paper) => {
                    return !_.isEqual(paper.key, this.paperKey);
                });
                this.paperKey = content.papers[0].key;
                this.paperText = content.papers[0].text;
            }
        },

        clickSave(event): void {
            this.save().then((res) => {
                if (res) {
                    console.info('save success.');

                    this.hasSaved = true;
                } else {
                    console.info('save failed.');
                }
            }).catch((e) => {
                console.info('save failed.', e);
            })
        },

        save(): Promise<boolean> {
            return new Promise<string>((resolve, reject) => {
                if (_.isEmpty(this.filePath)) {
                    let option: SaveDialogOptions = {
                        filters: [
                            {name: 'Ent Files', extensions: ['ent']}
                        ]
                    };
                    electron.remote.dialog.showSaveDialog(option, (fileName) => {
                        if (fileName) {
                            this.filePath = fileName;
                            resolve(fileName);
                        } else {
                            reject('cancel');
                        }

                    })

                } else {
                    resolve(this.filePath);
                }
            }).then((filePath) => {
                return Promise.resolve({
                    filePath: filePath,
                    password: this.password,
                })

            }).then(({filePath, password}) => {
                console.info('file path', filePath, 'pwd', password);
                return this.fileContent.saveToFile(filePath, password);
            });

        },

        clickNewFile(event): void {
            electron.ipcRenderer.send(Action.NewWin);
        },

        clickOpenFile(event): void {
            console.info('click open file');

            new Promise<string>((resolve, reject) => {
                let option: OpenDialogOptions = {
                    title: 'open file',
                    filters: [
                        {name: 'Ent Files', extensions: ['ent']},
                        // {name: 'All Files', extensions: ['*']}
                    ],
                    properties: ['openFile']
                };
                electron.remote.dialog.showOpenDialog(option, (fileNames) => {
                    if (fileNames && fileNames.length > 0) {
                        resolve(fileNames[0])
                    } else {
                        reject('cancel');
                    }
                });

            }).then((fileName) => {
                if (_.isEmpty(this.fileContent.config.fileName)
                    && _.isEmpty(this.fileContent.papers.length === 1
                        && _.isEmpty(this.fileContent.papers[0].text)
                    )) {

                    this.load(fileName);

                } else {
                    electron.ipcRenderer.send(Action.OpenFile, fileName);
                }
            });
        },

        load(filePath: string): void {
            this.filePath = filePath;
            let getPassword = (resolve, reject) => {
                enDialog.prompt('Please Input Password', '', (event, value) => {
                    this.password = value;
                    resolve(value);
                }, () => {
                    reject('cancel input pwd.');
                });
            };

            this.fileContent.loadFromFile(this.filePath, getPassword).then((fileContent) => {
                this.paperKey = fileContent.papers[0].key;
                this.paperText = fileContent.papers[0].text;
                this.isLocked = fileContent.config.encrypted;
                Vue.nextTick(() => {
                    this.canClose = true;
                });
                console.info('load file success.');

            }).catch((e) => {
                console.info('load file failed.', e);
            });

        },

        clickLock(event): void {
            if (this.isLocked) {
                this.password = null;
                this.isLocked = false;
            } else {
                new Promise((resolve, reject) => {
                    enDialog.prompt('Please Input New Password', '', (event, value) => {
                        this.password = value;
                        resolve(value);
                    }, () => {
                        reject('cancel input pwd.');
                    });

                }).then((password) => {
                    this.password = password;
                    this.isLocked = true;
                }).catch(() => {
                    // ignore.
                });
            }

        }
    },

    mounted() {
        this.processArgs();
        this.processWin();
        this.processIpc();
    },

});
