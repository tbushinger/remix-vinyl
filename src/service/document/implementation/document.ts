import Promise from 'bluebird';
import { DocType } from 'document';
import omit from 'lodash/omit';
import { Session } from 'session';
import { Repo } from "../../../repo/repo"
import DocumentService from "../document";
import { create, update, patch, extractHeader, filterBy } from '../../../model/document';

function createIndexName(documentType: string): string {
    return `${documentType}-index`;
}

function createIndexModel(model: DocType): DocType {
    return omit(model, 'body');
}

export default class DocumentServiceImpl implements DocumentService {
    repo: Repo;
    indexRepo: Repo;
    constructor(repo: Repo, indexRepo: Repo) {
        this.repo = repo;
        this.indexRepo = indexRepo;
    }

    save(session: Session, documentType: string, documentPayload: any): Promise<DocType> {
        const model: DocType = create(documentType, session.userid, documentPayload.head, documentPayload.body);
        return this.repo.save(documentType, model)
            .then(() => this.indexRepo.save(createIndexName(documentType), createIndexModel(model))
                .then(() => extractHeader(model)));
    }

    update(session: Session, documentType: string, documentId: string, documentPayload: any): Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then(currentModel => update(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then(updatedModel => this.repo.save(documentType, updatedModel)
                .then(updatedModel => this.indexRepo.save(createIndexName(documentType), createIndexModel(updatedModel))
                    .then(() => extractHeader(updatedModel))));
    }

    patch(session: Session, documentType: string, documentId: string, documentPayload: any): Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then(currentModel => patch(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then(updatedModel => this.repo.save(documentType, updatedModel)
                .then(updatedModel => this.indexRepo.save(createIndexName(documentType), createIndexModel(updatedModel))
                    .then(() => extractHeader(updatedModel))));
    }

    get(session: Session, documentType: string, documentId: string): Promise<DocType> {
        return this.repo.get(documentType, documentId);
    }

    list(session: Session, documentType: string): Promise<DocType[]> {
        return this.indexRepo.list(createIndexName(documentType))
            .then(list => list.map(extractHeader));
    }

    remove(session: Session, documentType: string, documentId: string): Promise<boolean> {
        return this.repo.remove(documentType, documentId)
            .then(() => this.indexRepo.remove(createIndexName(documentType), documentId)
                .then(() => true));
    }

    filterBy(session: Session, documentType: string, path: string, value: any, op: string): Promise<DocType[]> {
        return this.list(session, documentType)
            .then(list => filterBy(list, path, value, op));
    }
}