import Promise from 'bluebird';
import DocumentService from "../service/document/document";
import { Request } from "../types/request";
import { DocType } from 'document';

export class DocumentRoutes {
    docService : DocumentService;
    constructor(documentService : DocumentService) {
        this.docService = documentService;
    }

    save(req: Request) : Promise<DocType> {
        return this.docService.save(req.session, req.params.documentType, req.body);
    }

    update(req: Request) : Promise<DocType> {
        return this.docService.update(req.session, req.params.documentType, req.params.documentId, req.body);
    }

    patch(req: Request) : Promise<DocType> {
        return this.docService.patch(req.session, req.params.documentType, req.params.documentId, req.body);
    }

    get(req: Request) : Promise<DocType> {
        return this.docService.get(req.session, req.params.documentType, req.params.documentId);
    }

    list(req: Request) : Promise<DocType[]> {
        return this.docService.list(req.session, req.params.documentType);
    }

    remove(req: Request) : Promise<boolean> {
        return this.docService.remove(req.session, req.params.documentType, req.params.documentId);
    }
 
    filterBy(req: Request) : Promise<DocType[]> {
        return this.docService.filterBy(req.session, req.params.documentType, req.query.path, req.query.value, req.query.op);
    }
}