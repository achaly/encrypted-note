import * as querystring from "querystring";
import * as URL from "url";
import * as Vue from "vue/dist/vue";
import {config} from "../common/config";
import {locale} from "../common/locale";
import {FileContent} from "../common/fileContent";
import {remote, ipcRenderer} from "electron";
import BrowserWindow = Electron.BrowserWindow;
import OpenDialogOptions = Electron.OpenDialogOptions;
import * as _ from "underscore";
import {generateUUID} from "../common/utils";
import {Action} from "../common/channelEnum";

remote.getCurrentWindow().webContents.openDevTools();

interface IWinConfig {
    filePath: string;
    fileContent: FileContent;
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
            }
        },

        clickSave: function (event) {
            this.fileContent.saveToFile(winConfig.filePath)
                .then(function () {
                    console.log('save file success.');
                })
                .catch(function (e) {
                    console.info('save file error', e);
                })
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
            remote.dialog.showOpenDialog(option, (fileNames) => {
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
    ipcRenderer.on(Action.NewTab, function () {
        vue.clickNewTab();
    });

    ipcRenderer.on(Action.CloseWin, function () {
        let fileContent: FileContent = vue.fileContent;
        fileContent.saveToFile(winConfig.filePath)
            .then(function () {
                console.log('save file success.');
                remote.getCurrentWindow().close();
            })
            .catch(function (e) {
                console.info('save file error', e);
            })
    })

}

ipc();

function processArgs(): IWinConfig {
    let config: IWinConfig = {
        filePath: null,
        fileContent: new FileContent()
    };
    let url = URL.parse(window.location.href, true);
    if (url.query) {
        config.filePath = url.query['filePath'];
    }
    return config;
}
