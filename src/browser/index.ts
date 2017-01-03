import BrowserWindow = Electron.BrowserWindow;
import OpenDialogOptions = Electron.OpenDialogOptions;
import SaveDialogOptions = Electron.SaveDialogOptions;

import * as querystring from "querystring";
import * as URL from "url";
import * as Vue from "vue/dist/vue";
import * as _ from "underscore";
import * as electron from "electron";

import {config} from "../common/config";
import {locale} from "../common/locale";
import {FileContent} from "../common/fileContent";
import {generateUUID} from "../common/utils";
import {Action} from "../common/ipc";
import ShowMessageBoxOptions = Electron.ShowMessageBoxOptions;

electron.remote.getCurrentWindow().webContents.openDevTools();

interface IWinConfig {
    filePath: string;
    password: string;
    fileContent: FileContent;
}

function processArgs(): IWinConfig {
    let config: IWinConfig = {
        filePath: null,
        password: 'encrypted-note',
        fileContent: new FileContent()
    };
    let url = URL.parse(window.location.href, true);
    if (url.query) {
        config.filePath = url.query['filePath'];
    }
    return config;
}
const winConfig: IWinConfig = processArgs();

const vue = new Vue({
    el: '#index',
    data: {
        fileContent: null,
        password: '',

        paperKey: '',
        paperText: '',

        showEditor: true,

        hasSaved: false,
    },

    computed: {
        sidebarList: function () {
            let list = [];
            if (this.fileContent) {
                let content: FileContent = this.fileContent;
                _.forEach(content.papers, function (paper) {
                    let m = paper.text.substr(0, 10).match(/[^\s\b\n\f\r\t\v]+/);
                    let title = m ? m[0] : '';
                    list.push({
                        key: paper.key,
                        title: title,
                        createdAt: paper.createdAt,
                        updatedAt: paper.updatedAt,
                        text: paper.text
                    })
                })
            }
            return list;
        }
    },

    watch: {
        paperText: function () {
            if (this.fileContent) {
                this.hasSaved = false;
                let content: FileContent = this.fileContent;
                let paper = _.find(content.papers, (paper) => {
                    return paper.key === this.paperKey;
                });
                if (paper) {
                    paper.text = this.paperText;
                }
            }
        }
    },

    methods: {
        clickSidebarItem: function (item) {
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

        clickNewTab: function (event) {
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

        clickSave: function (event) {
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

        save: function () {
            return new Promise<string>((resolve, reject) => {
                if (!winConfig.filePath) {
                    let option: SaveDialogOptions = {
                        filters: [
                            {name: 'Ent Files', extensions: ['ent']}
                        ]
                    };
                    electron.remote.dialog.showSaveDialog(option, (fileName) => {
                        if (fileName) {
                            resolve(fileName);
                        } else {
                            reject('cancel');
                        }

                    })

                } else {
                    resolve(winConfig.filePath);
                }
            }).then((filePath) => {
                return this.fileContent.saveToFile(filePath);
            });

        },

        clickOpenFile: function (event) {
            // openFile();


            let option: OpenDialogOptions = {
                title: 'open file',
                filters: [
                    {name: 'Ent Files', extensions: ['ent']},
                    {name: 'All Files', extensions: ['*']}
                ],
                properties: ['openFile']
            };
            electron.remote.dialog.showOpenDialog(option, (fileNames) => {
                if (fileNames.length > 0) {
                    let filePath = fileNames[0];

                    console.info(filePath);

                    // contentManager.loadFromFile(filePath)
                    //     .then((fileContent: FileContent) => {
                    //         fileContent.config;
                    //         fileContent.papers;
                    //
                    //         this.sidebarList = []
                    //
                    //         let keys = contentManager.getPaperKeys();
                    //         _.forEach(keys, (k: string) => {
                    //
                    //             let title = k;
                    //             let paper = contentManager.getPaperByKey(k);
                    //
                    //             this.sidebarList.push({
                    //                 title, paper
                    //             })
                    //         })
                    //     })
                }
            })
        },
    },

    mounted() {
        this.showEditor = true;
        this.fileContent = winConfig.fileContent;
        this.paperKey = winConfig.fileContent.papers[0].key;
        this.paperText = winConfig.fileContent.papers[0].text;

        if (winConfig.filePath) {
            winConfig.fileContent.loadFromFile(winConfig.filePath)
                .then((fileContent) => {
                    console.log('file content', fileContent);
                    this.paperKey = fileContent.papers[0].key;
                    this.paperText = fileContent.papers[0].text;
                    console.info('load file success.');
                })
                .catch(function (e) {
                    console.info('load file error.', e);
                })
        }

    },

});

function ipc() {
    electron.ipcRenderer.on(Action.NewTab, function () {
        vue.clickNewTab();
    });

    electron.ipcRenderer.on(Action.SaveFile, function () {
        vue.clickSave();
    });

    electron.ipcRenderer.on(Action.CloseWin, function () {
        new Promise<number>((resolve, reject) => {
            if (vue.hasSaved) {
                resolve(3);
                return;
            }

            let option: ShowMessageBoxOptions = {
                type: 'question',
                buttons: ['save', 'donnot save', 'cancel'],
                defaultId: 0,
                title: 'Message',
                message: 'Save???',
                cancelId: 2
            };
            electron.remote.dialog.showMessageBox(option, (response) => {
                resolve(response);
            })

        }).then((res) => {
            switch (res) {
                case 0: { // save
                    return vue.save();
                }
                case 1: { // don't save
                    electron.remote.getCurrentWindow().close();
                    return Promise.reject('do not save');
                }
                case 2: { // cancel.
                    return Promise.reject('cancel');
                }
                case 3: { // has saved.
                    electron.remote.getCurrentWindow().close();
                    return Promise.reject('has saved');
                }
                default: {
                    return Promise.reject('unknown err.');
                }
            }

        }).then((res) => {
            if (res) {
                console.info('save success.');
            } else {
                console.info('save failed.');
            }

        }).catch((e) => {
            console.info('close win', e);
        });

    })

}

ipc();
