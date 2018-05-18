import { DocType } from 'document';

export interface Repo {
    save: (payloadType: string, payload: DocType) => DocType,
    get: (payloadType: string, id: string) => DocType,
    remove: (payloadType: string, id: string) => boolean,
    list: (payloadType: string, fnMap: any) => DocType[]
}

export enum RepoType {
    FileSystem,
}