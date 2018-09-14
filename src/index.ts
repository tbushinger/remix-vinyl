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

// Env vars and defaults
const port = process.env.PORT || 3000;
const defaultUser = process.env.DEFAULT_USER || 'system';
const docRepoType = process.env.DOC_REPO_TYPE || 'memory';
const docRepoDir = process.env.DOC_REPO_DIR || '_data';
const docRepoHost = process.env.DOC_REPO_HOST || 'localhost';
const docRepoPort = process.env.DOC_REPO_PORT || '27017';
const docRepoDb = process.env.DOC_REPO_DB || 'rmxStorage';
const docIndexType = process.env.DOC_INDEX_TYPE || 'memory';
const docIndexDir = process.env.DOC_INDEX_DIR || '_index';
const docIndexHost = process.env.DOC_INDEX_HOST || 'localhost';
const docIndexPort = process.env.DOC_INDEX_PORT || '6379';
const docIndexDb = process.env.DOC_INDEX_DB || 'rmxIndex';
const connectTries = process.env.CONNECT_TRIES || '10';
const retryInterval = process.env.RETRY_INTERVAL || '1000';

// Setup Repositories
function setupRepo(type: string, dir: string, host: string, port: string, db: string): Repo {
  if (type === 'fileSystem') {
    return createRepo(RepoType.FileSystem, dir);
  } else if (type === 'mongodb') {
    const url: string = `mongodb://${host}:${port}`;
    return createRepo(RepoType.MongoDb, MongoClient, url, db);
  } else if (type === 'redis') {
    const url: string = `redis://${host}:${port}`;
    return createRepo(RepoType.Redis, redis, url);
  } else { // memory
    return createRepo(RepoType.Memory);
  }
}

const documentRepo: Repo = setupRepo(docRepoType, docRepoDir, docRepoHost, docRepoPort, docRepoDb);
const indexRepo: Repo = setupRepo(docIndexType, docIndexDir, docIndexHost, docIndexPort, docIndexDb);

// Setup Services
const documentService: DocumentService = createDocumentService(documentRepo, indexRepo);

// Setup Route handlers
const documentRoutes: DocumentRoutes = createDocumentRoutes(documentService);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler());
app.use(sessionMW({ userId: defaultUser }));

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
const loadSession: Session = { userid: defaultUser };
let tries: number = parseInt(connectTries);
let iRetryInterval: number = parseInt(retryInterval);
let lasterror: any;

function loadIndexes() {
  if (tries === 0) {
    console.log(lasterror);
    throw new Error("Failed to connect to data stores and load indexes!");
  }

  console.log(`Loading indexes . . .`);

  documentService.loadIndexes(loadSession)
    .then((count) => {
      console.log(`${count} Document indexes succesfully loaded!`);
      console.log(`Starting app...`);

      app.listen(port);
    })
    .catch((err) => {
      lasterror = err;
      tries--;
      console.log("connection not ready!");
      console.log(`Number of retries: ${tries}`);
      console.log(`Reconnect in ${retryInterval}ms . . .`);
      console.log("");
      setTimeout(loadIndexes, iRetryInterval);
    });
}

loadIndexes();
