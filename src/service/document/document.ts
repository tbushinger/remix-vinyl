import Promise from 'bluebird';
import { DocType } from 'document';
import { Session } from 'session';

export default interface DocumentService {
    save(session: Session, documentType: string, documentPayload: any) : Promise<DocType>,
    update(session: Session, documentType: string, documentId: string, documentPayload: any) : Promise<DocType>,
    patch(session: Session, documentType: string, documentId: string, documentPayload: any) : Promise<DocType>,
    get(session: Session, documentType: string, documentId: string) : Promise<DocType>,
    list(session: Session, documentType: string) : Promise<DocType[]>,
    remove(session: Session, documentType: string, documentId: string) : Promise<boolean>,
    filterBy(session: Session, documentType: string, path: string, value: any, op: string) : Promise<DocType[]>
    loadIndexes(session: Session) : Promise<number>
}