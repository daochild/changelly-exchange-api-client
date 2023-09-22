import * as crypto from 'crypto';
import axios, {AxiosResponse} from 'axios';
import {KeyObject} from "crypto";
import {JsonRpcResponse} from "./typing/rpc.types";
import { Buffer } from 'node:buffer';

import {
    ChangellyResponse,
    CreateFixTransactionDetails,
    CreateTransactionDetails,
    CreateTransactionWithRefundDetails,
    Currency,
    CurrencyPair,
    CurrencyPairInfo,
    CurrencyPairWithAmount,
    ExchangeDetails, ExchangeInfo, ExchangeInfoWithAmount,
    ExchangeTransaction, FinishedTransaction,
    FixedExchangeTransaction,
    SearchTransactions, TransactionStatus, ValidationResult
} from "./typing/changelly.types.js";

export class Changelly {
    private readonly apiKey: string;
    private readonly privKey: KeyObject;

    public static readonly version: string = '2.0';
    public static readonly url: string = 'https://api.changelly.com/v2';

    constructor(apiKey: string, privKey: string) {
        this.apiKey = apiKey;
        this.privKey = crypto.createPrivateKey({
            key: privKey,
            format: 'der',
            type: 'pkcs8'
        });
    }

    private _id(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    private _sign(message: object): string {
        // @ts-ignore
        return crypto.sign('sha256', Buffer.from(JSON.stringify(message)), {
            // @ts-ignore
            key: this.privKey,
            type: 'pkcs8',
            format: 'der'
        }).toString('base64');
    }

    private async _request(method: string, params: any): Promise<any|JsonRpcResponse> {
        const message = {
            "jsonrpc": "2.0",
            "id": this._id(),
            "method": method,
            "params": params
        };
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.apiKey,
                'X-Api-Signature': this._sign(message)
            },
        }

        return new Promise((resolve, reject) => {
            axios.post(Changelly.url, message, axiosConfig)
                .then((response: AxiosResponse) => {
                    if (response.data.error) {
                        reject(response.data.error);
                    } else {
                        resolve(response.data.result);
                    }
                })
                .catch((error: any) => {
                    if (axios.isAxiosError(error)) {
                        reject(error.message);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    public static agreeWithKycMessage = function (): string {
        return 'Exchange services provided by Changelly. By clicking “Accept”, I acknowledge and understand that my transaction may trigger AML/KYC verification according to Changelly AML/KYC”';
    }

    public static kycRequestMessage = function (): string {
        return 'Your transaction has been frozen. Please contact with Changelly security team at security@changelly.com in order to pass the KYC procedure.';
    }

    public async createTransaction(
        params: CreateTransactionDetails|CreateTransactionWithRefundDetails
    ): Promise<ChangellyResponse<ExchangeTransaction>> {
        return this._request('createTransaction', params);
    }

    public async createFixTransaction(
        params: CreateFixTransactionDetails
    ): Promise<ChangellyResponse<FixedExchangeTransaction>> {
        return this._request('createFixTransaction', params);
    }

    public async getCurrencies(): Promise<ChangellyResponse<string[]>> {
        return this._request('getCurrencies', {});
    }

    public async getCurrenciesFull(): Promise<ChangellyResponse<Currency[]>> {
        return this._request('getCurrenciesFull', {});
    }

    public async getPairsParams(params: CurrencyPair[]): Promise<ChangellyResponse<CurrencyPairInfo[]>> {
        if (params.length === 0) {
            throw new Error("Pairs empty");
        }

        return this._request('getPairsParams', params);
    }

    public async getMinAmount(
        from: string,
        to: string
    ): Promise<ChangellyResponse<string>> {
        const params = {
            from: from,
            to: to,
        };

        console.warn("getMinAmount: method DEPRECATED")

        return this._request('getMinAmount', params);
    }

    public async getExchangeAmount(
        params: CurrencyPairWithAmount|CurrencyPairWithAmount[]
    ): Promise<ChangellyResponse<ExchangeDetails[]>> {
        return this._request('getExchangeAmount', params);
    }

    public async getTransactions(
        params: SearchTransactions
    ): Promise<ChangellyResponse<FinishedTransaction[]>> {
        return this._request('getTransactions', params);
    }

    public async getStatus(id: string): Promise<ChangellyResponse<TransactionStatus>> {
        const params = {
            id: id,
        };

        return this._request('getStatus', params);
    }

    public async getFixRate(params: CurrencyPair[]): Promise<ChangellyResponse<ExchangeInfo[]>> {
        if (params.length === 0) {
            throw new Error("Pairs empty");
        }

        return this._request('getFixRate', params);
    }

    public async getFixRateForAmount(params: CurrencyPairWithAmount[]): Promise<ChangellyResponse<ExchangeInfoWithAmount[]>> {
        if (params.length === 0) {
            throw new Error("Pairs empty");
        }

        return this._request('getFixRateForAmount', params);
    }

    public async validateAddress(currency: string, address: string): Promise<ChangellyResponse<ValidationResult>> {
        const params = {
            currency: currency,
            address: address,
        };

        return this._request('validateAddress', params);
    }
}
