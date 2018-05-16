import lodash from "lodash";
import uuid from 'uuid';
import { DocSchema, DocMeta, DocType } from "document";

const START_VERSION = '1.0.0';

function getTs() {
    return (new Date()).toISOString();
}

function incrVersion(version: string) {
    const parts = version.split(/\./);
    const [ major, minor, revision ] = parts.map(p => parseInt(p));
    
    return ([ major, minor, revision + 1 ]).join('.');
}

export function create(documentType: string, userId: string = 'composer', head: any = {}, body: any = {}) : DocType {
    const ts = getTs();
    const schema: DocSchema = {
        version: START_VERSION,
        type: documentType
    };

    const meta: DocMeta = {
        version: START_VERSION,
        createdOn: ts,
        createdBy: userId,
        updatedOn: ts,
        updatedBy: userId       
    }

    const doc: DocType = {
        id: uuid.v4(),
        schema,
        meta,
        head,
        body
    }

    return doc;
}
/*
function update(model, userId = 'composer', head = {}, body = {}) {
    return Object.assign({}, model, {
        meta: Object.assign({}, model.meta || {}, {
            version: incrVersion(model.meta.version),
            updatedOn: getTs(),
            updatedBy: userId
        }),
        head,
        body
    });
}

function patch(model, userId = 'composer', head = {}, body = {}) {
    return update(model, userId, 
        Object.assign({}, model.head, head),
        Object.assign({}, model.body, body));
}

function extractHeader(model) {
    return omit(model, 'body');
}

function _toLowerCase(text) {
    return ((text || '') + '').toLowerCase();
}

function _includes(c,v) {
    return _toLowerCase(c).includes(_toLowerCase(v));
}

const ops = {
    eq: (c,v) => c === v,
    neq: (c,v) => c != v,
    lt: (c,v) => v < c,
    lte: (c,v) => v <= c,
    gt: (c,v) => v > c,
    gte: (c,v) => v >= c,
    isnull: c => c == null,
    notnull: c => c != null,    
    incl: _includes
}

function filterBy(list, path, value, op = 'eq') {
    return list.filter(item => 
        ops[op](get(item, path, null), value));
}

module.exports = {
    create,
    update,
    patch,
    extractHeader,
    filterBy
}
*/