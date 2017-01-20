import * as crypto from "crypto";

export interface ICrypto {
    encrypt(key: string, source: string): string;

    decrypt(key: string, dist: string): string;

    md5(key: string): string;
}

class ENCrypto implements ICrypto {
    encrypt(pwd: string, source: string): string {
        let cipher = crypto.createCipher('aes-128-cbc', pwd);
        let crypted = cipher.update(source, 'utf8', 'binary');
        crypted += cipher.final('binary');
        crypted = new Buffer(crypted, 'binary').toString('base64');
        return crypted;
    }

    decrypt(pwd: string, dist: string): string {
        dist = new Buffer(dist, 'base64').toString('binary');
        let decipher = crypto.createDecipher('aes-128-cbc', pwd);
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

export const enCrypto = new ENCrypto();
