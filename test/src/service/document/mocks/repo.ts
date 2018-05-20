import BluebirdPromise from "bluebird";
import { DocType } from "../../../../../src/types/document";
import { Repo } from "../../../../../src/repo/repo";

class MochRepo implements Repo {
  doc: DocType = null;
  save(payloadType: string, payload: DocType) : BluebirdPromise<DocType> {
    return new BluebirdPromise(resolve => {
      this.doc = payload;
      resolve(payload)
    });
  }
  get(payloadType: string, id: string) : BluebirdPromise<DocType> {
    return new BluebirdPromise(resolve => {
      resolve(this.doc)
    });
  }
  remove(payloadType: string, id: string) : BluebirdPromise<boolean> {
    return new BluebirdPromise(resolve => {
      resolve(true)
    });
  }
  list(payloadType: string) : BluebirdPromise<DocType[]> {
    return new BluebirdPromise(resolve => {
      resolve([this.doc])
    });    
  }
}

export default function createMockRepo() : Repo {
  return new MochRepo();
}