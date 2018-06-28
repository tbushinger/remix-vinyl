import get from 'lodash/get';

let document: any;

const collection = {
    save: (doc: any, callback: any) => {
        if (get(doc, 'payload.head.fail', false)) {
            callback(new Error("cannot save doc"), null);
        } else {
            document = doc;
            callback(null, true);
        }
    },
    findOne: (query: any, callback: any) => {
        callback(null, document);
    },
    removeOne: (query: any, callback: any) => {
        document = null;
        callback(null, true);
    },
    find: (query: any) => {
        return {
            toArray: (callback: any) => {
                callback(null, [document]);
            }
        }
    }
}

const client = {
    db: () => {
        return { 
            collection: () => collection
        }
    },
    close: () => {}
}

export default function() {
    console.log('HERE')
    return {
        connect: (url: string, callback: any) => {
            if (!(url)) {
                callback(new Error("connection error"), null);
            } else {
                callback(null, client);
            }
        }
    }
}