const omit = require('lodash/omit');
const uuid = require('uuid');
const get = require('lodash/get');

const START_VERSION = '1.0.0';

function getTs() {
    return (new Date()).toISOString();
}

function incrVersion(version) {
    const parts = version.split(/\./);
    const [ major, minor, revision ] = parts.map(p => parseInt(p));
    
    return ([ major, minor, revision + 1 ]).join('.');
}

function create(documentType, userId = 'composer', head = {}, body = {}) {
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
    };
}

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