import BluebirdPromise from "bluebird";
import { DocType } from "../../../../src/types/document";
import { Session } from "../../../../src/types/session";
import DocumentService from "../../../../src/service/document/document";

export default class MockDocumentService implements DocumentService {
    doc: DocType = null;
    save(session: Session, documentType: string, documentPayload: any) : BluebirdPromise<DocType> {
        return new BluebirdPromise(resolve => {
            this.doc = documentPayload;
            resolve(documentPayload);
        });
    }

    update(session: Session, documentType: string, documentId: string, documentPayload: any) : BluebirdPromise<DocType> {
        return new BluebirdPromise(resolve => {
            this.doc = documentPayload;
            resolve(documentPayload);
        });
    }

    patch(session: Session, documentType: string, documentId: string, documentPayload: any) : BluebirdPromise<DocType> {
        return new BluebirdPromise(resolve => {
            this.doc = documentPayload;
            resolve(documentPayload);
        });
    }

    get(session: Session, documentType: string, documentId: string) : BluebirdPromise<DocType> {
        return new BluebirdPromise(resolve => {
            resolve(this.doc);
        });
    }

    list(session: Session, documentType: string) : BluebirdPromise<DocType[]> {
        return new BluebirdPromise(resolve => {
            resolve([this.doc]);
        });    
    }

    remove(session: Session, documentType: string, documentId: string) : BluebirdPromise<boolean> {
        return new BluebirdPromise(resolve => {
            resolve(true);
        });
    }

    filterBy(session: Session, documentType: string, path: string, value: any, op: string) : BluebirdPromise<DocType[]> {
        return new BluebirdPromise(resolve => {
            resolve([this.doc]);
        });
    }    

    loadIndexes(session: Session): BluebirdPromise<number> {
        return new BluebirdPromise((resolve) => {
            resolve(0);
        });
    }
}