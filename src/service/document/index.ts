import DocumentServiceImpl from "./implementation/document";
import DocumentService from "./document";
import { Repo } from "../../repo/repo";

let instance : DocumentService = null;

export default function createDocumentService(repo: Repo) : DocumentService {
    if (!(instance)) {
        instance = new DocumentServiceImpl(repo);
    } 
    
    return instance;    
}