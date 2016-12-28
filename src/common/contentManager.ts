import * as fs from "fs";
import {generateUUID} from "./utils";

const demo = {
    config: {
        fileName: '',
    },
    content: {
        key1: {
            createdAt: '',
            updatedAt: '',
            text: ''
        },
        key2: {
            createdAt: '',
            updatedAt: '',
            text: ''
        }
    }
};

export interface IContentManager {

    newContent(): string;

    delContent(key: string): void;

    updateContent(key: string, text: string): string;

    loadFromFile(filePath?: string): boolean;

    saveToFile(filePath: string): boolean;

}

export class ContentManager implements IContentManager {
    fileContent: { config: {}, content: {} };

    newContent(): string {
        let key = generateUUID().substr(0, 7);
        let now = Date.now();
        this.fileContent.content[key] = {
            createdAt: now,
            updatedAt: now,
            text: ''
        };
        return key;
    }

    delContent(key: string): void {
        delete this.fileContent.content[key];
    }

    updateContent(key: string, text: string): string {
        this.fileContent.content[key].text = text;
        this.fileContent.content[key].updatedAt = Date.now();
        return key;
    }

    loadFromFile(filePath?: string): boolean {
        // decrypt
        if (!filePath) {
            return true;
        }

        let str = fs.readFileSync(filePath).toString();

        try {
            let tempObj = JSON.parse(str);
            if (tempObj.hasOwnProperty('config') && tempObj.hasOwnProperty('content')) {
                this.fileContent = tempObj;
                return true;
            }
        } catch (e) {
            console.error(e);
        }

        return false;
    }

    saveToFile(filePath: string): boolean {
        fs.writeFileSync(filePath, JSON.stringify(this.fileContent));
        return true;
    }

}