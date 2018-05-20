import Promise from 'bluebird';
import { DocType } from 'document';
import { Session } from 'session';
import { Repo } from "../../../repo/repo"
import DocumentService from "../document";
import { create, update, patch, extractHeader, filterBy } from '../../../model/document';

export default class DocumentServiceImpl implements DocumentService {
    repo : Repo;
    constructor(repo: Repo) {
        this.repo = repo;
    }

    save(session: Session, documentType: string, documentPayload: any) : Promise<DocType> {
        const model: DocType = create(documentType, session.userid, documentPayload.head, documentPayload.body);
        return this.repo.save(documentType, model).then(() => 
            extractHeader(model));
    }

    update(session: Session, documentType: string, documentId: string, documentPayload: any) : Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then(currentModel => update(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then(updatedModel => this.repo.save(documentType, updatedModel)
            .then(() => extractHeader(updatedModel)));
    }

    patch(session: Session, documentType: string, documentId: string, documentPayload: any) : Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then(currentModel => patch(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then(updatedModel => this.repo.save(documentType, updatedModel)
            .then(() => extractHeader(updatedModel)));
    }

    get(session: Session, documentType: string, documentId: string) : Promise<DocType> {
        return this.repo.get(documentType, documentId);
    }

    list(session: Session, documentType: string) : Promise<DocType[]> {
        return this.repo.list(documentType)
            .then(list => list.map(extractHeader));
    }

    remove(session: Session, documentType: string, documentId: string) : Promise<boolean> {
        return this.repo.remove(documentType, documentId).then(() => true);
    }

    filterBy(session: Session, documentType: string, path: string, value: any, op: string) : Promise<DocType[]> {
        return this.list(session, documentType)
            .then(list => filterBy(list, path, value, op));
    }    
}