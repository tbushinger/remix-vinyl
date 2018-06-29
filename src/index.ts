import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from 'express';
import errorHandler from "errorhandler";
import { MongoClient } from 'mongodb';

import sessionMW from "./middleware/session";
import requestMW from "./middleware/request";

import { RepoType, Repo } from "./repo/repo";
import createRepo from "./repo";

import DocumentService from "./service/document/document";
import createDocumentService from "./service/document";

import { DocumentRoutes } from "./routes/document";
import { createDocumentRoutes } from "./routes";

const app = express();

// Env vars
// TODO: lets not use app settings and gettings, a little to verbose
dotenv.config({ path: ".env" });
app.set("port", process.env.PORT || 3000);
app.set("default-user", process.env.DEFAULT_USER || 'system');
// types: memory, fileSystem
app.set("doc-repo-type",  process.env.DOC_REPO_TYPE  || 'memory');
app.set("doc-repo-dir",   process.env.DOC_REPO_DIR   || '_data');
app.set("doc-repo-host",  process.env.DOC_REPO_HOST  || 'localhost');
app.set("doc-repo-port",  process.env.DOC_REPO_PORT  || '27017');
app.set("doc-repo-db",    process.env.DOC_REPO_DB    || 'rmxStorage');
app.set("doc-index-type", process.env.DOC_INDEX_TYPE || 'memory');
app.set("doc-index-dir",  process.env.DOC_INDEX_DIR  || '_index');
app.set("doc-index-host", process.env.DOC_INDEX_HOST || 'localhost');
app.set("doc-index-port", process.env.DOC_INDEX_PORT || '27017');
app.set("doc-index-db",   process.env.DOC_INDEX_DB   || 'rmxIndex');

// Setup Repositories/Services
// TODO: combine into single method
const docRepoType = app.get("doc-repo-type");
let documentRepo: Repo;
if (docRepoType === 'fileSystem') {
  documentRepo = createRepo(RepoType.FileSystem, app.get("doc-repo-dir"));
} else if (docRepoType === 'mongodb') {
  const url: string = `mongodb://${app.get('doc-repo-host')}:${app.get('doc-repo-port')}`;
  const db: string = app.get('doc-repo-db');
  documentRepo = createRepo(RepoType.MongoDb, MongoClient, url, db);
} else { // memory
  documentRepo = createRepo(RepoType.Memory);
}

const docIndexType = app.get("doc-index-type");
let indexRepo: Repo;
if (docIndexType === 'fileSystem') {
  indexRepo = createRepo(RepoType.FileSystem, app.get("doc-index-dir"));
} else if (docRepoType === 'mongodb') {
  const url: string = `mongodb://${app.get('doc-index-host')}:${app.get('doc-index-port')}`;
  const db: string = app.get('doc-index-db');
  indexRepo = createRepo(RepoType.MongoDb, MongoClient, url, db);
} else { // memory
  indexRepo = createRepo(RepoType.Memory);
};

// TODO: Create an index loader function for cases where the storage is mongo but the indexes
// are in memory or redis

const documentService: DocumentService = createDocumentService(documentRepo, indexRepo);

// Setup Route handlers
const documentRoutes: DocumentRoutes = createDocumentRoutes(documentService);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler());
app.use(sessionMW({ userId: app.get("default-user") }));

// Setup Routes
const documentsRouter = express.Router({ mergeParams: true });

documentsRouter.get('/search/:documentType',
  requestMW((req: any) => documentRoutes.filterBy(req)));
documentsRouter.get('/:documentType',
  requestMW((req: any) => documentRoutes.list(req)));
documentsRouter.get('/:documentType/:documentId',
  requestMW((req: any) => documentRoutes.get(req)));
documentsRouter.post('/:documentType',
  requestMW((req: any) => documentRoutes.save(req)));
documentsRouter.put('/:documentType/:documentId',
  requestMW((req: any) => documentRoutes.update(req)));
documentsRouter.patch('/:documentType/:documentId',
  requestMW((req: any) => documentRoutes.patch(req)));
documentsRouter.delete('/:documentType/:documentId',
  requestMW((req: any) => documentRoutes.remove(req)));

app.use('/documents', documentsRouter);

// Start App
app.listen(app.get("port"));