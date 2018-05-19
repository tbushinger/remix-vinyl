import Promise from 'bluebird';
import fs from 'fs-extra';
import Path from 'path';
import { isString } from 'lodash';
import { DocType } from 'document';
import { Repo } from '../repo';

const outputFile: any = Promise.promisify(fs.outputFile);
const readFile: any = Promise.promisify(fs.readFile);
const unlink: any = Promise.promisify(fs.unlink);
const readdir: any = Promise.promisify(fs.readdir);

export default class FileRepo implements Repo {    
    rootPath: string;
    createFileName: any = (id: string, ext: string = 'json') : string  => 
        `${id}.${ext}`;

    createFilePath: any = (payloadType: string, fileName: string) : string => 
        Path.join(this.rootPath, payloadType, fileName);

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    save(payloadType: string, payload: DocType) : Promise<DocType> {
        const id = (isString(payload)) ? JSON.parse(payload).id : payload.id;
        const filePath = this.createFilePath(payloadType, this.createFileName(id));
        return outputFile(filePath, (isString(payload)) ? payload : JSON.stringify(payload))
            .then(() => payload);
    }

    get(payloadType: string, id: string) : Promise<DocType> {
        const filePath = this.createFilePath(payloadType, this.createFileName(id));
        return readFile(filePath, 'utf8').then((text: string) => JSON.parse(text));
    }

    remove(payloadType: string, id: string) : Promise<boolean> {
        const filePath = this.createFilePath(payloadType, this.createFileName(id));
        return unlink(filePath).then(() => true);
    }

    list(payloadType: string) : Promise<DocType[]> {
        return readdir(`${this.rootPath}/${payloadType}`).then((items: string[]) => 
            Promise.mapSeries(items, item => this.get(payloadType, item.split(/\./)[0])));
    }
}