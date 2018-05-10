/* eslint-disable import/no-extraneous-dependencies, global-require, import/no-dynamic-require */

function create({ reqModel, model, repo }) {
    
    function post(req) {
        const { documentType, userid, jsonData } = reqModel.extract(req);
        const { head = {}, body = {} } = jsonData;

        const payload = model.create(documentType, userid, head, body);

        return repo.save(documentType, payload).then(() => 
            model.extractHeader(payload));
    }

    function put(req) {
        const { documentType, documentId, userid, jsonData } = reqModel.extract(req);
        const { head = {}, body = {} } = jsonData;

        return repo.get(documentType, documentId)
            .then(currentModel => 
                model.update(currentModel, userid, head, body))
            .then(updatedModel => repo.save(documentType, updatedModel).then(() => 
                model.extractHeader(updatedModel)));
    }

    function patch(req) {
        const { documentType, documentId, userid, jsonData } = reqModel.extract(req);
        const { head = {}, body = {} } = jsonData;

        return repo.get(documentType, documentId)
            .then(currentModel => 
                model.patch(currentModel, userid, head, body))
            .then(updatedModel => repo.save(documentType, updatedModel).then(() => 
                model.extractHeader(updatedModel)));
    }

    function _get(req) {
        const { documentType, documentId } = reqModel.extract(req);
        return repo.get(documentType, documentId);
    }

    function list(req) {
        const { documentType } = reqModel.extract(req);
        return repo.list(documentType, model.extractHeader);
    }

    function del(req) {
        const { documentType, documentId } = reqModel.extract(req);
        return repo.remove(documentType, documentId);
    }

    // TODO: It may be necessary to allow queries into the body section of the document
    function filterBy(req) {
        const { documentType } = req.params;
        const { path, value, op } = req.query;
        return repo.list(documentType, model.extractHeader)
            .then(items => model.filterBy(items, path, value, op));
    }

    return {
        post,
        put,
        patch,
        get: _get,
        list,
        del,
        filterBy
    }
};

module.exports = {
    create
}