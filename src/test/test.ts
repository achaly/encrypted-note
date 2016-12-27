
import {config} from '../common/config';
import {LocaleEnum} from "../common/locale";

config.load();
console.log(config.getLocale());
console.log(config.setLocale(LocaleEnum.zh_CN));
console.log(config.getLocale());
config.save();

