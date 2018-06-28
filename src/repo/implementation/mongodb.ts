import Promise from 'bluebird';
import isFunction from 'lodash/isFunction';

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

export default class MongoDBRepo implements Repo {
    url: string;
    dbName: string;
    mongoClient: any;
    constructor(mongoClient: any, url: string, dbName: string) {
        this.url = url;
        this.dbName = dbName;
        this.mongoClient = mongoClient;
    }

    connect(fnExec: any, fnError: any) {
        const self = this;
        this.mongoClient.connect(this.url, function (err: any, client: any) {
            if (err) {
                fnError(err);
                return;
            }
            const conn = client.db(self.dbName);
            fnExec(conn, () => {
                client.close();
            });
        });
    }

    save(payloadType: string, payload: DocType): Promise<DocType> {
        return new Promise((resolve, reject) => {
            this.connect((db: any, close: any) => {
                const collection = db.collection(payloadType);
                const mongoDoc = {
                    _id: payload.id,
                    payload
                }
                collection.save(mongoDoc, (err: any) => {
                    handleResult(err, payload, resolve, reject, close);
                })
            }, reject);
        });
    }

    get(payloadType: string, id: string): Promise<DocType> {
        return new Promise((resolve, reject) => {
            this.connect((db: any, close: any) => {
                const collection = db.collection(payloadType);
                collection.findOne({ _id: id }, (err: any, doc: any) => {
                    handleResult(err, () => doc.payload, resolve, reject, close);
                })
            }, reject);
        });
    }

    remove(payloadType: string, id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connect((db: any, close: any) => {
                const collection = db.collection(payloadType);
                collection.removeOne({ _id: id }, (err: any) => {
                    handleResult(err, true, resolve, reject, close);
                })
            }, reject);
        });
    }

    list(payloadType: string): Promise<DocType[]> {
        return new Promise((resolve, reject) => {
            this.connect((db: any, close: any) => {
                const collection = db.collection(payloadType);
                collection.find({}).toArray((err: any, docs: any) => {
                    handleResult(err, () => docs.map((doc: any) => doc.payload), resolve, reject, close);
                })
            }, reject);
        });
    }
}