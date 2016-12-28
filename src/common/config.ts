import * as fs from "fs";
import * as path from "path";
import {LocaleEnum} from "./locale";

interface IConfig {
    locale: LocaleEnum;

    getLocale(): LocaleEnum;

    setLocale(locale: LocaleEnum): void;

    load(): void;

    save(): void;
}

class Config implements IConfig {
    configPath: string;
    locale: LocaleEnum = LocaleEnum.en;

    constructor() {
        this.configPath = path.join(__dirname, "../res/config/config.json");
        console.log('configPath', __dirname);
        this.load();
    }

    getLocale(): LocaleEnum {
        return this.locale;
    }

    setLocale(locale: LocaleEnum): void {
        this.locale = locale;
    }

    load(): void {
        let res = fs.readFileSync(this.configPath).toString();
        let obj = null;
        try {
            obj = JSON.parse(res);
        } catch (e) {
            // ignore
        }

        if (!obj) {
            return;
        }

        // parse locale.
        let locale = obj.locale;
        switch (locale) {
            case "en": {
                this.locale = LocaleEnum.en;
                break;
            }
            case "zh_CN": {
                this.locale = LocaleEnum.zh_CN;
                break;
            }
            default: {
                this.locale = LocaleEnum.en;
            }
        }
    }

    save(): void {
        let locale = 'en';
        switch (this.locale) {
            case LocaleEnum.en: {
                locale = 'en';
                break;
            }
            case LocaleEnum.zh_CN: {
                locale = "zh_CN";
                break;
            }
            default: {
                locale = 'en';
            }
        }
        let res = {
            locale: locale
        };
        fs.writeFileSync(this.configPath, JSON.stringify(res));
    }

}

export const config = new Config();
