import * as process from "process";
import crypto from "node:crypto";
import {expect} from 'chai';
import {Changelly} from '../src';
import "dotenv/config";

describe('static methods check', () => {
    it('should get KYC message', () => {
        expect(
            Changelly.agreeWithKycMessage(),
            'Exchange services provided by Changelly. By clicking “Accept”, I acknowledge and understand that my transaction may trigger AML/KYC verification according to Changelly AML/KYC”'
        );
    });
})

describe('dynamic methods', () => {
    const generateKeys = () => {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "pkcs1",
                format: "der",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "der",
            },
        });

        return ({
            privateKey: privateKey.toString("hex"),
            publicKey: publicKey.toString("base64"),
            apiBase64: crypto.createHash("sha256").update(publicKey).digest("base64"),
        });
    }

    it('should initialize', () => {
        new Changelly(String(process.env.CHANGELLY_API_KEY).trim(), String(process.env.CHANGELLY_PRIVATE_KEY).trim());
    })

    it('should initialize', async () => {
        const changelly = new Changelly(String(process.env.CHANGELLY_API_KEY).trim(), String(process.env.CHANGELLY_PRIVATE_KEY).trim());

        await changelly.getCurrencies()
            .then(console.log)
            .catch(console.error);
    })
})