import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';

let documents: any = {};

const client = {
    hset: (key: string, id: string, text: string, callback: any) => {
        const doc = JSON.parse(text);
        if (get(doc, 'head.fail', false)) {
            callback(new Error("cannot save doc"), null);
        } else {
            set(documents, `${key}.${id}`, text);
            callback(null, true);
        }
    },
    hget: (key: string, id: string, callback: any) => {
        callback(null, get(documents, `${key}.${id}`));
    },
    hdel: (key: string, id: string, callback: any) => {
        unset(documents, `${key}.${id}`);
        callback(null, true);
    },
    hgetall: (key: string, callback: any) => {
        callback(null,  get(documents, `${key}`));
    },
    quit: () => {}
}

export default function() {
    return {
        createClient: (url: string) => {
            if (!(url)) {
                throw new Error("connection error")
            } 
            return client;
        }
    }
}