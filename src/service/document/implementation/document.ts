import Promise from 'bluebird';
import { DocType } from 'document';
import omit from 'lodash/omit';
import { Session } from 'session';
import { Repo } from "../../../repo/repo"
import DocumentService from "../document";
import { create, update, patch, extractHeader, filterBy } from '../../../model/document';
import { Result } from '../../../../node_modules/@types/range-parser';

const DOCUMENT_MANIFEST = 'document-manifest';

function createIndexName(documentType: string): string {
    return `${documentType}-index`;
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
            .then((updatedModel: DocType) => this.repo.save(DOCUMENT_MANIFEST, extractHeader(updatedModel)))
            .then((idxModel: DocType) => this.indexRepo.save(createIndexName(documentType), idxModel))
    }

    update(session: Session, documentType: string, documentId: string, documentPayload: any): Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then((currentModel: DocType) => update(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then((updatedModel: DocType) => this.repo.save(documentType, updatedModel))
            .then((updatedModel: DocType) => this.repo.save(DOCUMENT_MANIFEST, extractHeader(updatedModel)))
            .then((updatedModel: DocType) => this.indexRepo.save(createIndexName(documentType), updatedModel));
    }

    patch(session: Session, documentType: string, documentId: string, documentPayload: any): Promise<DocType> {
        return this.repo.get(documentType, documentId)
            .then((currentModel: DocType) => patch(currentModel, session.userid, documentPayload.head, documentPayload.body))
            .then((updatedModel: DocType) => this.repo.save(documentType, updatedModel))
            .then((updatedModel: DocType) => this.repo.save(DOCUMENT_MANIFEST, extractHeader(updatedModel)))
            .then((updatedModel: DocType) => this.indexRepo.save(createIndexName(documentType), updatedModel));
    }

    get(session: Session, documentType: string, documentId: string): Promise<DocType> {
        return this.repo.get(documentType, documentId);
    }

    list(session: Session, documentType: string): Promise<DocType[]> {
        return this.indexRepo.list(createIndexName(documentType));
    }

    remove(session: Session, documentType: string, documentId: string): Promise<boolean> {
        return this.repo.remove(documentType, documentId)
            .then(() => this.repo.remove(createIndexName(DOCUMENT_MANIFEST), documentId))
            .then(() => this.indexRepo.remove(createIndexName(documentType), documentId))
            .then(() => true);
    }

    filterBy(session: Session, documentType: string, path: string, value: any, op: string): Promise<DocType[]> {
        return this.list(session, documentType)
            .then((list: DocType[]) => filterBy(list, path, value, op));
    }

    loadIndexes(session: Session): Promise<number> {
        return this.repo.list(DOCUMENT_MANIFEST)
            .then((docs: DocType[]) => Promise.mapSeries(docs, (doc: DocType) =>
                this.indexRepo.save(createIndexName(doc.schema.type), doc))
                .then((updated: any[]) => updated.length));
    }
}