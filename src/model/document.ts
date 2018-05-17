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

export function create(documentType: string, userId: string, head: any, body: any) : DocType {
    const ts = getTs();

    return {
        id: uuid.v4(),
        schema: {
            version: START_VERSION,
            type: documentType
        },
        meta: {
            version: START_VERSION,
            createdOn: ts,
            createdBy: userId,
            updatedOn: ts,
            updatedBy: userId
        },
        head,
        body
    }
}

export function update(model: DocType, userId: string, head: any, body: any) : DocType {
    const meta: any = model.meta || { version: '1.0.0' };
    return Object.assign({}, model, {
        meta: Object.assign({}, meta, {
            version: incrVersion(meta.version),
            updatedOn: getTs(),
            updatedBy: userId
        }),
        head,
        body
    });
}

export function patch(model: DocType, userId: string, head: any, body: any) : DocType {
    return update(model, userId, 
        Object.assign({}, model.head, head),
        Object.assign({}, model.body, body));
}

export function extractHeader(model: DocType) : DocType {
    return lodash.omit(model, 'body');
}

function _toLowerCase(text: string) {
    return ((text || '') + '').toLowerCase();
}

function _includes(c: string,v: string) {
    return _toLowerCase(c).includes(_toLowerCase(v));
}

const ops = [
    { op: 'eq', fn: (c: any,v: any) => c === v },
    { op: 'neq', fn: (c: any,v: any) => c != v },
    { op: 'lt', fn: (c: any,v: any) => v < c },
    { op: 'lte', fn: (c: any,v: any) => v <= c },
    { op: 'gt', fn: (c: any,v: any) => v > c },
    { op: 'gte', fn: (c: any,v: any) => v >= c },
    { op: 'isnull', fn: (c: any) => c == null },
    { op: 'notnull', fn:  (c: any) => c != null },    
    { op: 'incl', fn: _includes }
];

function getOp(op: string) : any {
    const found = ops.find(o => o.op === op);
    return (found) ? found.fn : getOp('eq');
}

export function filterBy(list: DocType[], path: string, value: any, op: string = 'eq') : DocType[] {
    return list.filter(item => 
        getOp(op)(lodash.get(item, path, null), value));
}