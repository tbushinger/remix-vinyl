import assert from "assert";
import { describe, it } from "mocha";
import { DocType } from "../../../src/types/document";
import { Session } from "../../../src/types/session";
import MockDocumentService from "./mocks/mockDocumentService";
import DocumentService from "../../../src/service/document/document";
import { createDocumentRoutes } from "../../../src/routes/index";
import { Request } from "../../../src/types/request";

const service : DocumentService = new MockDocumentService();
const route = createDocumentRoutes(service);

const session : Session = { userid: 'testUser' };
const body : any = { body: {}, head: {} };
const documentType: string = 'mydoctype';
const documentId: string = 'myDocId';

describe('document route', function() { 
  it('save', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType
      },
      body,
      session
    }

    const result: DocType = await route.save(req);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('update', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType,
        documentId
      },
      body,
      session
    }

    const result: DocType = await route.update(req);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('patch', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType,
        documentId
      },
      body,
      session
    }

    const result: DocType = await route.patch(req);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('get', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType,
        documentId
      },
      body: null,
      session
    }

    const result: DocType = await route.get(req);
    //console.dir(result, { colors: true });
    assert(result);
  });

  it('list', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType
      },
      body: null,
      session
    }

    const result: DocType[] = await route.list(req);
    //console.dir(result, { colors: true });
    assert(result.length != undefined && result.length > 0);
  });

  it('filterBy', async function() {
    const req : Request = {
      query: {
        'path': '',
        'value': '',
        'op': 'eq'
      },
      headers: {},
      params: {
        documentType
      },
      body: null,
      session
    }

    const result: DocType[] = await route.filterBy(req);
    //console.dir(result, { colors: true });
    assert(result.length != undefined && result.length > 0);
  });

  it('remove', async function() {
    const req : Request = {
      query: {},
      headers: {},
      params: {
        documentType,
        documentId
      },
      body: null,
      session
    }

    const result: boolean = await route.remove(req);
    //console.dir(result, { colors: true });
    assert(result);
  });
});
