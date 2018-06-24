import DocumentServiceImpl from "./implementation/document";
import DocumentService from "./document";
import { Repo } from "../../repo/repo";

let instance : DocumentService = null;

export default function createDocumentService(repo: Repo, indexRepo: Repo) : DocumentService {
    if (!(instance)) {
        instance = new DocumentServiceImpl(repo, indexRepo);
    } 
    
    return instance;    
}