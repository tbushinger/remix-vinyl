import assert from "assert";
import BluebirdPromise from "bluebird";
import { describe, it } from "mocha";
import createDocumentService from "../../../../../src/service/document";
import DocumentService from "../../../../../src/service/document/document";
import { DocType } from "../../../../../src/types/document";
import { Session } from "../../../../../src/types/session";
import { Repo } from "../../../../../src/repo/repo";
import createMockRepo from "../mocks/repo";

const repo: Repo = createMockRepo();
const service : DocumentService = createDocumentService(repo);
const session : Session = { userid: 'testUser' };
const documentPayload : any = { body: {}, head: {} };
const documentType: string = 'mydoctype';
const documentId: string = 'myDocId';

describe('document service - implementation', function() { 
  it('save', async function() {
    const result: DocType = await service.save(session, documentType, documentPayload);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('update', async function() {
    const result: DocType = await service.update(session, documentType, documentId, documentPayload);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('patch', async function() {
    const result: DocType = await service.patch(session, documentType, documentId, documentPayload);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('get', async function() {
    const result: DocType = await service.get(session, documentType, documentId);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('list', async function() {
    const result: DocType[] = await service.list(session, documentType);
    //console.dir(result, { colors: true });
    assert(result.length != undefined && result.length > 0);
  });

  it('remove', async function() {
    const result: boolean = await service.remove(session, documentType, documentId);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('filterBy', async function() {
    const result: DocType[] = await service.filterBy(session, documentType, 'meta.createdBy', null, 'notnull');
    //console.dir(result, { colors: true });
    assert(result.length != undefined && result.length > 0);
  });
});
