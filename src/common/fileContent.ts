import * as fs from "fs";
import {enCrypto} from "./enCrypto";
import {generateUUID} from "./utils";

export class FileContent {
    config: {encrypted: boolean};
    papers: {key: string, createdAt: number, updatedAt: number, text: string}[];

    constructor() {
        this.config = {encrypted: false};
        this.papers = [{key: generateUUID(), text: '', createdAt: 0, updatedAt: 0}];
    }

    loadFromFile(filePath: string, getPassword?: (resolve, reject) => void): Promise<FileContent> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (data) {
                    let dataText = data.toString();

                    try {
                        let obj = JSON.parse(dataText);
                        if (obj.hasOwnProperty('config') && obj.config.hasOwnProperty('encrypted')) {
                            this.config = obj.config;

                            // get new password.
                            if (this.config.encrypted && obj.hasOwnProperty('cipherText') && getPassword) {
                                new Promise<string>(getPassword).then((password) => {
                                    this.papers = JSON.parse(enCrypto.decrypt(password, obj.cipherText));
                                    resolve(this);

                                }).catch(() => {
                                    reject('get pwd error');
                                });
                                return;

                            } else if (!this.config.encrypted && obj.hasOwnProperty('papers')) {
                                this.papers = obj.papers;
                                resolve(this);
                                return;

                            }
                        }

                    } catch (e) {
                        console.log('json error', e);
                    }

                }

                reject('load file error');
            });

        });
    }

    saveToFile(filePath: string, password?: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!_.isEmpty(password)) {
                this.config.encrypted = true;
            } else {
                this.config.encrypted = false;
            }

            let data = {
                config: this.config
            };

            if (this.config.encrypted) {
                data = _.extend({}, data, {
                    cipherText: enCrypto.encrypt(password, JSON.stringify(this.papers))
                })
            } else {
                data = _.extend({}, data, {
                    papers: this.papers
                })
            }

            fs.writeFile(filePath, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

}
