import * as fs from "fs";
import * as path from "path";

export enum LocaleEnum {
    en,
    zh_CN,
}

interface ILocale {
    setLocale(locale: LocaleEnum): void;

    get(key: string): string;
}

class Locale implements ILocale {
    private defaultLocale: LocaleEnum;
    private i18n: {};

    setLocale(locale: LocaleEnum): void {
        this.defaultLocale = locale;

        let filename = 'en';
        switch (locale) {
            case LocaleEnum.en: {
                filename = 'en';
                break;
            }
            case LocaleEnum.zh_CN: {
                filename = 'zh_CN';
                break;
            }
            default: {
                filename = 'en';
            }
        }

        let file = path.join(__dirname, '../res/i18n/', filename + '.json');
        console.log('file', file);
        try {
            let res = fs.readFileSync(file).toString();
            this.i18n = JSON.parse(res);
        } catch (e) {
            // ignore
        }
    }

    get(key: string): string {
        if (this.i18n) {
            return this.i18n[key];

        } else {
            return '';
        }
    }

}

export const locale = new Locale();
