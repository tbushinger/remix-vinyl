import bodyParser from "body-parser";
import express from 'express';
import errorHandler from "errorhandler";
import { MongoClient } from 'mongodb';
import redis from 'redis';

import sessionMW from "./middleware/session";
import requestMW from "./middleware/request";

import { RepoType, Repo } from "./repo/repo";
import { Session } from "./types/session";
import createRepo from "./repo";

import DocumentService from "./service/document/document";
import createDocumentService from "./service/document";

import { DocumentRoutes } from "./routes/document";
import { createDocumentRoutes } from "./routes";

const app = express();

// Env vars
app.set("port", process.env.PORT || 3000);
app.set("default-user", process.env.DEFAULT_USER || 'system');
app.set("doc-repo-type", process.env.DOC_REPO_TYPE || 'memory');
app.set("doc-repo-dir", process.env.DOC_REPO_DIR || '_data');
app.set("doc-repo-host", process.env.DOC_REPO_HOST || 'localhost');
app.set("doc-repo-port", process.env.DOC_REPO_PORT || '27017');
app.set("doc-repo-db", process.env.DOC_REPO_DB || 'rmxStorage');
app.set("doc-index-type", process.env.DOC_INDEX_TYPE || 'memory');
app.set("doc-index-dir", process.env.DOC_INDEX_DIR || '_index');
app.set("doc-index-host", process.env.DOC_INDEX_HOST || 'localhost');
app.set("doc-index-port", process.env.DOC_INDEX_PORT || '6379');
app.set("doc-index-db", process.env.DOC_INDEX_DB || 'rmxIndex');
app.set("connect-tries", process.env.CONNECT_TRIES || '10');
app.set("retry-interval", process.env.RETRY_INTERVAL || '1000');

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
} else if (docRepoType === 'redis') {
  const url: string = `redis://${app.get('doc-repo-host')}:${app.get('doc-repo-port')}`;
  documentRepo = createRepo(RepoType.Redis, redis, url);
} else { // memory
  documentRepo = createRepo(RepoType.Memory);
}

const docIndexType = app.get("doc-index-type");
let indexRepo: Repo;
if (docIndexType === 'fileSystem') {
  indexRepo = createRepo(RepoType.FileSystem, app.get("doc-index-dir"));
} else if (docIndexType === 'mongodb') {
  const url: string = `mongodb://${app.get('doc-index-host')}:${app.get('doc-index-port')}`;
  const db: string = app.get('doc-index-db');
  indexRepo = createRepo(RepoType.MongoDb, MongoClient, url, db);
} else if (docIndexType === 'redis') {
  const url: string = `redis://${app.get('doc-index-host')}:${app.get('doc-index-port')}`;
  indexRepo = createRepo(RepoType.Redis, redis, url);
} else { // memory
  indexRepo = createRepo(RepoType.Memory);
};

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

// Start App when indexes have been loaded
const loadSession: Session = { userid: app.get("default-user") };
let tries: number = parseInt(app.get("connect-tries"));
let retryInterval: number = parseInt(app.get("retry-interval"));

function loadIndexes() {
  if (tries === 0) {
    throw new Error("Failed to connect to data stores and load indexes!")
  }

  console.log(`Loading indexes . . .`);

  documentService.loadIndexes(loadSession)
    .then((count) => {
      console.log(`${count} Document indexes succesfully loaded!`);
      console.log(`Starting app...`);

      app.listen(app.get("port"));
    })
    .catch(() => {
      tries--;
      console.log("connection not ready!");
      console.log(`Number of retries: ${tries}`);
      console.log(`Reconnect in ${retryInterval}ms . . .`);
      console.log("");
      setTimeout(loadIndexes, retryInterval);
    });
}

loadIndexes();
