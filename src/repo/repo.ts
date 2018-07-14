import Promise from 'bluebird';
import { DocType } from 'document';

export interface Repo {
    save: (payloadType: string, payload: DocType) => Promise<DocType>,
    get: (payloadType: string, id: string) => Promise<DocType>,
    remove: (payloadType: string, id: string) => Promise<boolean>,
    list: (payloadType: string) => Promise<DocType[]>
}

export enum RepoType {
    FileSystem,
    Memory,
    MongoDb,
    Redis
}