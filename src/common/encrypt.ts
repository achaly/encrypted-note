import * as crypto from "crypto";

export interface IEncrypt {
    encrypt(key: string, source: string): string;

    decrypt(key: string, dist: string): string;

    md5(key: string): string;
}

class Encrypt implements IEncrypt {
    encrypt(key: string, source: string): string {
        let iv = this.md5(key);
        let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let crypted = cipher.update(source, 'utf8', 'binary');
        crypted += cipher.final('binary');
        crypted = new Buffer(crypted, 'binary').toString('base64');
        return crypted;
    }

    decrypt(key: string, dist: string): string {
        let iv = this.md5(key);
        dist = new Buffer(dist, 'base64').toString('binary');
        let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decoded = decipher.update(dist, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }

    md5(key: string): string {
        let md5 = crypto.createHash('md5');
        let value = md5.update(key);
        return value.digest('hex');
    }

}

export const encrypt = new Encrypt();
