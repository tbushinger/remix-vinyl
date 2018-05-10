/* eslint-disable import/no-extraneous-dependencies, global-require, import/no-dynamic-require */

const Promise = require('bluebird');
const Hapi = require('hapi');
const model = require('./model/document');
const reqModel = require('./model/request');
const fileRepo = require('./repo/file.system');
const docRoutes = require('./routes/document');

// TODO: Make this options configurable via remix settings.js file
const port = 3031;
const DATA_PATH = `${__dirname}/_data`;
const logger = console;

const repo = fileRepo.create(DATA_PATH);
const docRoute = docRoutes.create({ reqModel, model, repo });

const server = new Hapi.Server({ port });

server.route({ method: 'POST', path: '/documents/{documentType}', handler: docRoute.post });
server.route({ method: 'PUT', path: '/documents/{documentType}/{documentId}', handler: docRoute.put });
server.route({ method: 'PATCH', path: '/documents/{documentType}/{documentId}', handler: docRoute.patch });
server.route({ method: 'GET', path: '/documents/{documentType}/search', handler: docRoute.filterBy });
server.route({ method: 'GET', path: '/documents/{documentType}/{documentId}', handler: docRoute.get });
server.route({ method: 'GET', path: '/documents/{documentType}', handler: docRoute.list });
server.route({ method: 'DELETE', path: '/documents/{documentType}/{documentId}', handler: docRoute.del });

server.start((err) => {
    logger.log(`Local File Server is started @ http://localhost:${port}`);
    if (err) { throw err; }
});
