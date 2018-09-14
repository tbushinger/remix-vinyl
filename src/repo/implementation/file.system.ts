import Promise from 'bluebird';
import fs from 'fs-extra';
import Path from 'path';
import { DocType } from 'document';
import { Repo } from '../repo';

const outputFile: any = Promise.promisify(fs.outputFile);
const readFile: any = Promise.promisify(fs.readFile);
const unlink: any = Promise.promisify(fs.unlink);
const readdir: any = Promise.promisify(fs.readdir);
const exists: any = Promise.promisify(fs.pathExists);

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
        const filePath = this.createFilePath(payloadType, this.createFileName(payload.id));
        return outputFile(filePath, JSON.stringify(payload))
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
        const sDir: string = `${this.rootPath}/${payloadType}`;
        return exists(sDir).then((doesExist: boolean) => {
            if (!doesExist) {
                return Promise.resolve([]);
            } else {
                return readdir(sDir).then((items: string[]) => {
                    console.log(items)
                    return Promise.mapSeries(items, item => this.get(payloadType, item.split(/\./)[0]));
                });
            }
        });
    }
}