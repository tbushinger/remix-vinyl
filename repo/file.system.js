const Promise = require('bluebird');
const fs = require('fs-extra');
const Path = require('path');
const isString = require('lodash/isString');

const outputFile = Promise.promisify(fs.outputFile);
const readFile = Promise.promisify(fs.readFile);
const unlink = Promise.promisify(fs.unlink);
const readdir = Promise.promisify(fs.readdir);

function createFileName(id, ext = 'json') {
    return `${id}.${ext}`;
}

function create(rootPath) {

    function createFilePath(payloadType, fileName) {
        return Path.join(rootPath, payloadType, fileName);
    }

    function save(payloadType, payload) {
        const id = (isString(payload)) ? JSON.parse(payload).id : payload.id;
        const filePath = createFilePath(payloadType, createFileName(id));
        return outputFile(filePath, (isString(payload)) ? payload : JSON.stringify(payload));
    }

    function _get(payloadType, id) {
        const filePath = createFilePath(payloadType, createFileName(id));
        return readFile(filePath, 'utf8').then(text => JSON.parse(text));
    }

    function remove(payloadType, id) {
        const filePath = createFilePath(payloadType, createFileName(id));
        return unlink(filePath);
    }

    function list(payloadType, fnMap) {
        return readdir(`${rootPath}/${payloadType}`).then(items => 
            Promise.mapSeries(items, item => _get(payloadType, item.split(/\./)[0]))
                .then(items => items.map(fnMap)));
    }

    return {
        save,
        get: _get,
        remove,
        list
    };
}

module.exports = {
    create
}