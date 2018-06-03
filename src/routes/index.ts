import DocumentService from "../service/document/document";
import { DocumentRoutes } from "./document";

export function createDocumentRoutes(documentService : DocumentService) : DocumentRoutes {
    return new DocumentRoutes(documentService);
}