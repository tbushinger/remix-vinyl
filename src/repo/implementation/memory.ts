import Promise from 'bluebird';
import set from 'lodash/set';
import get from 'lodash/get';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import { DocType } from 'document';
import { Repo } from '../repo';

export default class FileRepo implements Repo {    
    docs: any;

    constructor() {
        this.docs = {};
    }

    save(payloadType: string, payload: DocType) : Promise<DocType> {
        const doc = set(payload, 'schema.type', payloadType);
        this.docs[doc.id] = doc;
        return Promise.resolve(doc);
    }

    get(payloadType: string, id: string) : Promise<DocType> {
        const doc = get(this.docs, id, null);
        return Promise.resolve(doc);
    }

    remove(payloadType: string, id: string) : Promise<boolean> {
        this.docs = omit(this.docs, id);
        return Promise.resolve(true);
    }

    list(payloadType: string) : Promise<DocType[]> {
        const docs = keys(this.docs).map(key => this.docs[key]);
        return Promise.resolve(docs);
    }
}