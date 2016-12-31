import * as fs from "fs";
import {generateUUID} from "./utils";

export class FileContent {
    config: {fileName: string};
    papers: {key: string, createdAt: number, updatedAt: number, text: string}[];

    constructor() {
        this.config = {fileName: null};
        this.papers = [{key: generateUUID(), text: '', createdAt: 0, updatedAt: 0}];
    }

    loadFromFile(filePath: string): Promise<FileContent> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (data) {
                    // decrypt

                    let decryptedText = data.toString();

                    try {
                        let obj = JSON.parse(decryptedText);
                        if (obj.hasOwnProperty('config') && obj.hasOwnProperty('papers')) {
                            this.config = obj.config;
                            this.papers = obj.papers;
                            resolve(this);

                        } else {
                            reject('json error.');
                        }
                    } catch (e) {
                        reject(e);
                    }

                } else {
                    reject(err);
                }
            });

        });
    }

    saveToFile(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // encrpyt
            let encrpytedText = JSON.stringify(this);
            fs.writeFile(filePath, encrpytedText, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }
}
