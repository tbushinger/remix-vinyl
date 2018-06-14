import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from 'express';
import errorHandler from "errorhandler";

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
dotenv.config({ path: ".env" });
app.set("port",          process.env.PORT          || 3000);
app.set("default-user",  process.env.DEFAULT_USER  || 'system');
app.set("doc-repo-type", process.env.DOC_REPO_TYPE || 'fileSystem');
app.set("doc-repo-dir",  process.env.DOC_REPO_DIR  || '_data');

// Setup Repositories/Services
const repoType = app.get("doc-repo-type");
// TOOD: add more supported drivers
const documentRepo : Repo = (repoType === 'fileSystem') ?
  createRepo(RepoType.FileSystem, app.get("doc-repo-dir")) : null;

const documentService : DocumentService = createDocumentService(documentRepo);  

// Setup Route handlers
const documentRoutes : DocumentRoutes = createDocumentRoutes(documentService);

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
