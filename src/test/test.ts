
import {config} from '../common/config';
import {LocaleEnum} from "../common/locale";

// config.load();
// console.log(config.getLocale());
// console.log(config.setLocale(LocaleEnum.zh_CN));
// console.log(config.getLocale());
// config.save();
//

import * as crypto from "crypto";

// let x = crypto.getCiphers();
// console.info('x', x)

let md5 = crypto.createHash('md5');
let foo = md5.update('foo');
let hex = foo.digest('hex');

console.info('hex', hex);

