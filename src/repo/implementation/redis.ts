import Promise from 'bluebird';
import isFunction from 'lodash/isFunction';
import keys from 'lodash/keys';

import { DocType } from 'document';
import { Repo } from '../repo';

function handleResult(err: any, fnResult: any, resolve: any, reject: any, close: any) {
    if (err) {
        reject(err);
        return;
    }
    resolve(isFunction(fnResult) ? fnResult() : fnResult);
    close();
}

export default class RedisRepo implements Repo {
    url: string;
    redis: any;
    constructor(redis: any, url: string) {
        this.url = url;
        this.redis = redis;
    }

    connect(fnExec: any, fnError: any) {
        const self = this;
        try {
            const client = this.redis.createClient(this.url);
            fnExec(client, () => {
                client.quit();
            });
        } catch (err) {
            fnError(err);
        }
    }

    save(payloadType: string, payload: DocType): Promise<DocType> {
        return new Promise((resolve, reject) => {
            this.connect((client: any, close: any) => {
                const sPayload: string = JSON.stringify(payload);
                client.hset(payloadType, payload.id, sPayload, (err: any) => {
                    handleResult(err, payload, resolve, reject, close);
                })
            }, reject);
        });
    }

    get(payloadType: string, id: string): Promise<DocType> {
        return new Promise((resolve, reject) => {
            this.connect((client: any, close: any) => {
                client.hget(payloadType, id, (err: any, sPayload: string) => {
                    handleResult(err, () => JSON.parse(sPayload), resolve, reject, close);
                })
            }, reject);
        });
    }

    remove(payloadType: string, id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connect((client: any, close: any) => {
                client.hdel(payloadType, id, (err: any) => {
                    handleResult(err, true, resolve, reject, close);
                })
            }, reject);
        });
    }

    list(payloadType: string): Promise<DocType[]> {
        return new Promise((resolve, reject) => {
            this.connect((client: any, close: any) => {
                client.hgetall(payloadType, (err: any, oPayload: any) => {
                    handleResult(err, () => keys(oPayload).map((key: string) => JSON.parse(oPayload[key])), resolve, reject, close);
                })
            }, reject);
        });
    }
}